import { TSchema, Type } from '@sinclair/typebox'
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteHandlerMethod
} from 'fastify'
import { Hub, HubMiddleware } from '@/api/core/hub'
import { Endpoint } from '@/api/core/endpoint'
import { Context } from '@/api/core/context'
import {
  mergeScope,
  mergePath,
  mergeSchema,
  ScopeTree,
  matchScope,
  OptionalSchema
} from '@/api/core/utils'
import { verifyToken } from '@/api/core/token'
import { ratelimit } from '@/cache/ratelimit'
import { getSessionByToken } from '@/cache/session'
import { TError } from '@/api/core/schemas'
import { Logger } from '@/logger'

async function parseAndLimitToken(req: FastifyRequest, res: FastifyReply) {
  const authorization = req.headers.authorization
  if (authorization && authorization.startsWith('token ')) {
    const token = authorization.substr(6).trim()
    if (!verifyToken(token)) throw new Error('Invalid token')
    const rest = await ratelimit(token, 1000, 60)
    void res.header('x-rate-limit-remaining', rest.toString())
    return token
  } else {
    const rest = await ratelimit(req.ip, 1000, 60)
    void res.header('x-rate-limit-remaining', rest.toString())
  }
}

function generateFastifySchema(
  endpoint: Endpoint<OptionalSchema, OptionalSchema>,
  TIn: TSchema | null,
  path: string
): FastifySchema {
  const schema: FastifySchema = {}
  if (TIn) {
    schema[endpoint._method === 'GET' ? 'querystring' : 'body'] = Type.Strict(
      TIn
    )
  } else {
    Logger.warn(
      `API Endpoint [${endpoint._method}]${path} do not have input schema!`
    )
  }
  if (endpoint._raw) {
    schema.response = {
      400: TError
    }
  } else {
    if (endpoint._TOut) {
      if (
        endpoint._TOut.type === 'void' ||
        endpoint._TOut.type === 'undefined'
      ) {
        schema.response = {
          200: Type.Strict(
            Type.Object({
              ok: Type.Boolean(),
              e: Type.Optional(TError)
            })
          )
        }
      } else {
        schema.response = {
          200: Type.Strict(
            Type.Object({
              ok: Type.Boolean(),
              r: Type.Optional(endpoint._TOut!),
              e: Type.Optional(TError)
            })
          )
        }
      }
    } else {
      Logger.warn(
        `API Endpoint [${endpoint._method}]${path} do not have output schema!`
      )
    }
  }
  return schema
}

function generateContextInit(
  endpoint: Endpoint
): (req: FastifyRequest, res: FastifyReply) => Promise<Context> | Context {
  if (endpoint._method === 'GET') {
    return async (req, res) => {
      const token = await parseAndLimitToken(req, res)
      return {
        req,
        res,
        session: token ? await getSessionByToken(token) : null,
        payload: req.query
      }
    }
  } else {
    return async (req, res) => {
      const token = await parseAndLimitToken(req, res)
      return {
        req,
        res,
        session: token ? await getSessionByToken(token) : null,
        payload: req.body
      }
    }
  }
}

function scopeGuard(scopes: ScopeTree | undefined, scope: string) {
  if (!matchScope(scope, scopes)) throw new Error('Access denied')
}

function generateFastifyHandler(
  endpoint: Endpoint,
  scope: string,
  middlewares: HubMiddleware<any>[]
): RouteHandlerMethod {
  const contextInit = generateContextInit(endpoint)

  if (endpoint._raw) {
    return async (req, res) => {
      try {
        const ctx = await contextInit(req, res)
        scopeGuard(ctx.session?.scopes, scope)
        for (const middleware of middlewares) await middleware(ctx)
        const r = await endpoint._handler(ctx)
        return r
      } catch (e) {
        void res.code(400)
        return e.message
      }
    }
  } else {
    return async (req, res) => {
      try {
        const ctx = await contextInit(req, res)
        scopeGuard(ctx.session?.scopes, scope)
        for (const middleware of middlewares) await middleware(ctx)
        const r = await endpoint._handler(ctx)
        return { ok: true, r }
      } catch (e) {
        return { ok: false, e: e.message }
      }
    }
  }
}

function applyEndpoint(
  server: FastifyInstance,
  endpoint: Endpoint,
  scope: string,
  path: string,
  SIn: TSchema | null,
  middlewares: HubMiddleware<any>[]
) {
  scope = mergeScope(scope, endpoint._scope)
  path = mergePath(path, endpoint._path)
  SIn = mergeSchema(SIn, endpoint._TIn)

  Logger.info(`Apply API Endpoint [${endpoint._method}]${path} <${scope}>`)

  server.route({
    method: endpoint._method,
    url: path,
    schema: generateFastifySchema(endpoint, SIn, path),
    handler: generateFastifyHandler(endpoint, scope, middlewares)
  })
}

function walkHub(
  server: FastifyInstance,
  hub: Hub,
  scope: string,
  path: string,
  schema: TSchema | null,
  middlewares: HubMiddleware<any>[]
) {
  scope = mergeScope(scope, hub._scope)
  path = mergePath(path, hub._path)
  schema = mergeSchema(schema, hub._TIn)
  if (hub._middleware) {
    middlewares = [...middlewares, hub._middleware]
  }

  Logger.info(`Found API Hub ${path} <${scope}>`)

  for (const endpoint of hub._endpoints) {
    applyEndpoint(server, endpoint, scope, path, schema, middlewares)
  }
  hub._hubs.forEach((x) => walkHub(server, x, scope, path, schema, middlewares))
}

export function generateFastifyPlugin(root: Hub): FastifyPluginAsync {
  return async (server) => {
    walkHub(server, root, '.', '/', null, [])
  }
}
