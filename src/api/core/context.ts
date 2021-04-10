import { FastifyRequest, FastifyReply } from 'fastify'
import { buildScopeTree, ScopeTree } from '@/api/core/utils'
import { verifyToken } from '@/api/core/token'
import { Collections } from '@/db'
import { MAGICS } from '@/magics'

interface BaseSession {
  type: string
  user: string
  scopes: ScopeTree
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

export async function parseSession(
  req: FastifyRequest
): Promise<Session | null> {
  const authorization = req.headers.authorization
  if (authorization && authorization.startsWith('token ')) {
    const token = authorization.substr(6).trim()
    if (!verifyToken(token)) throw new Error('Invalid token')
    const info = await Collections.tokens.findOne({ _id: token })
    if (!info) throw new Error('Invalid token')
    if (info.type === 'user') {
      return {
        type: 'user',
        user: info.user,
        admin: info.admin,
        scopes: true
      }
    } else {
      return {
        type: 'app',
        user: info.user,
        app: info.app,
        scopes: await generateScopeTree(info.user, info.app)
      }
    }
  }
  return null
}
