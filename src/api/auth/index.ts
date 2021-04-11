import { generateUserToken, Hub } from '@/api/core'
import { SameUser } from '@/api/middleware'
import { HasUser } from '@/api/schema'
import { Collections, getSys } from '@/db'
import { Logger } from '@/logger'
import { Static, Type } from '@sinclair/typebox'
import { PassAuth } from '@/api/auth/pass'
import { DummyAuth } from '@/api/auth/dummy'

const providers = {
  pass: PassAuth,
  dummy: DummyAuth
} as const

type Providers = typeof providers

type ExtractSys<S extends { TSys: any }> = S extends { TSys: infer R } ? R : any
type ExtractLocal<S extends { TLocal: any }> = S extends { TLocal: infer R }
  ? R
  : any

export type AuthSysConfig = {
  [key in keyof Providers]?: {
    enabled: boolean
    config: Static<ExtractSys<Providers[key]>>
  }
}

export type AuthUserCred = {
  [key in keyof Providers]?: Static<ExtractLocal<Providers[key]>>
}
type ProviderName = keyof Providers
const providerNames = Object.keys(providers) as ProviderName[]

export const AuthRoot = new Hub().path('/auth')
const AuthUserHub = new Hub().scope('.auth').input(HasUser).middleware(SameUser)
const AuthActionHub = new Hub().scope('.').path('actions')

AuthRoot.hub(AuthUserHub).hub(AuthActionHub)

async function getLocalCred<T extends ProviderName>(
  user: string,
  name: T
): Promise<Exclude<AuthUserCred[T], undefined> | null> {
  const User = await Collections.users.findOne(
    { _id: user },
    { projection: { [`cred.${name}`]: 1 } }
  )
  if (!User) throw new Error('Not found')
  return name in User.cred ? (User.cred[name] as any) : null
}

async function setLocalCred<T extends ProviderName>(
  user: string,
  name: ProviderName,
  value: AuthUserCred[T]
) {
  await Collections.users.updateOne(
    { _id: user },
    { $set: { [`cred.${name}`]: value } }
  )
}

export async function setupAuthProviders() {
  const sys = await getSys('auth')
  let credSchema: any = null
  const verifiers: { [key: string]: any } = {}

  for (const name of providerNames) {
    const provider = providers[name]
    if (!(name in sys)) continue
    if (!sys[name]!.enabled) continue
    const config = sys[name]!.config
    if (provider.action) {
      AuthActionHub.endpoint((endpoint) =>
        endpoint
          .path(name)
          .input(provider.action!.TIn)
          .output(provider.action!.TOut)
          .handler((ctx) => provider.action!.handler(config, ctx.payload))
      )
    }
    AuthUserHub.hub((hub) =>
      hub
        .path(name)
        .endpoint((endpoint) =>
          endpoint
            .method('GET')
            .output(provider.TDetails)
            .handler(async (ctx) => {
              const local: any = await getLocalCred(ctx.payload.user, name)
              if (local === null) throw new Error('Not enabled')
              return provider.details(config, local)
            })
        )
        .endpoint((endpoint) =>
          endpoint
            .input(
              Type.Object({
                user: Type.String(),
                data: provider.TUpdate
              })
            )
            .output(Type.Void())
            .handler(async (ctx) => {
              const local: any = await getLocalCred(ctx.payload.user, name)
              const result = await provider.update(
                config,
                local,
                ctx.payload.data as any
              )
              await setLocalCred(ctx.session!.user, name, result)
            })
        )
    )
    verifiers[name] = (l: any, r: any) => provider.verify(config, l, r)
    if (credSchema === null) {
      credSchema = Type.Object(
        {
          [name]: provider.TVerify
        },
        { minProperties: 1, maxProperties: 2 }
      )
    } else {
      credSchema = Type.Intersect(
        [credSchema, Type.Object({ [name]: provider.TVerify })],
        { minProperties: 1, maxProperties: 2 }
      )
    }
  }
  if (credSchema === null) {
    Logger.warn('No auth provider enabled')
    return
  }

  AuthRoot.endpoint((endpoint) =>
    endpoint
      .path('login')
      .input(
        Type.Object({
          name: Type.String(),
          cred: Type.Partial(credSchema)
        })
      )
      .output(
        Type.Object({
          token: Type.String()
        })
      )
      .handler(async (ctx) => {
        if (ctx.session) throw new Error('Already logged in')

        const user = await Collections.users.findOne(
          { name: ctx.payload.name },
          { projection: { _id: 1, cred: 1, require2FA: 1 } }
        )
        if (!user) throw new Error('Not found')
        if (user.require2FA && Object.keys(ctx.payload.cred).length < 2)
          throw new Error('2FA required')
        for (const name in ctx.payload.cred) {
          if (!(name in user.cred)) throw new Error('Not enabled')
          const local = user.cred[name as ProviderName]!
          if (!(await verifiers[name](local, ctx.payload.cred[name])))
            throw new Error('Access denied')
        }
        const token = await generateUserToken(user._id)
        return { token }
      })
  )
}
