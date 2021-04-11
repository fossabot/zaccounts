import { FastifyRequest, FastifyReply } from 'fastify'
import { ScopeTree } from '@/api/core/utils'

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

export type Session = AppSession | UserSession

export interface Context<T = any> {
  req: FastifyRequest
  res: FastifyReply

  session: Session | null

  payload: T
}
