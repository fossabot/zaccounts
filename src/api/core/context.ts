import { FastifyRequest, FastifyReply } from 'fastify'
import { buildScopeTree, ScopeTree } from '@/api/core/utils'
import { Collections } from '@/db'
import { MAGICS } from '@/magics'

interface BaseSession {
  type: string
  user: string
  scopes: ScopeTree
  token: string
}

interface AppSession extends BaseSession {
  type: 'app'
  app: string
}

interface UserSession extends BaseSession {
  type: 'user'
  admin?: boolean
}

type Session = AppSession | UserSession

export interface Context<T = any> {
  req: FastifyRequest
  res: FastifyReply

  session: Session | null

  payload: T
}

async function generateScopeTree(user: string, app: string) {
  const key = `apps.${app}.perms.${MAGICS.appId}`
  const result = await Collections.users.findOne(
    { _id: user },
    { projection: { [key]: 1 } }
  )
  if (!result) throw new Error('Not found')
  const scopes = result.apps[app].perms[MAGICS.appId]
  return buildScopeTree(scopes)
}

export async function getSession(
  token: string | undefined
): Promise<Session | null> {
  if (!token) return null
  const info = await Collections.tokens.findOne({ _id: token })
  if (!info) throw new Error('Invalid token')
  if (info.type === 'user') {
    return {
      type: 'user',
      user: info.user,
      admin: info.admin,
      scopes: true,
      token
    }
  } else {
    return {
      type: 'app',
      user: info.user,
      app: info.app,
      scopes: await generateScopeTree(info.user, info.app),
      token
    }
  }
}
