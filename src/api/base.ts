import { Static, TAny, TNull, TObject, TSchema, Type } from '@sinclair/typebox'
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema
} from 'fastify'

export interface IContext<T = any> {
  req: FastifyRequest
  res: FastifyReply
  payload: T
}

export interface IEndpointHandler<
  TIn extends TSchema = TNull,
  TOut extends TSchema = TNull
> {
  (ctx: IContext<Static<TIn>>): Promise<Static<TOut>> | Static<TOut>
}

const defaultHandler = async () => {
  throw new Error('Not implemented')
}

type HTTPMethod = 'GET' | 'POST'

export class Endpoint<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TIn extends TSchema = TObject<{}>,
  TOut extends TSchema = TNull
> {
  _path = '/'
  _method: HTTPMethod = 'POST'
  _scope = ''
  _handler: IEndpointHandler<TIn, TOut> = defaultHandler
  _TIn: TIn = Type.Object({}) as TIn
  _TOut: TOut = Type.Null() as TOut

  path(path: string) {
    this._path = path
    return this
  }
  scope(scope: string) {
    this._scope = scope
    return this
  }
  method(method: HTTPMethod) {
    this._method = method
    return this
  }
  input<S extends TSchema>(schema: S) {
    this._TIn = schema as any
    return (this as any) as Endpoint<S, TOut>
  }
  output<S extends TSchema>(schema: S) {
    this._TOut = schema as any
    return (this as any) as Endpoint<TIn, S>
  }
  handler(handler: IEndpointHandler<TIn, TOut>) {
    this._handler = handler
    return this
  }
}

export class Collection<TIn extends TSchema = TAny> {
  _path = '/'
  _scope = ''
  _endpoints: Endpoint<any, any>[] = []
  _collections: Collection<any>[] = []
  _TIn: TIn | null = null

  path(path: string) {
    this._path = path
    return this
  }
  scope(scope: string) {
    this._scope = scope
    return this
  }
  input<S extends TSchema>(schema: S) {
    this._TIn = schema as any
    return (this as any) as Collection<S>
  }
  endpoint<SIn extends TSchema, SOut extends TSchema>(
    endpoint: Endpoint<SIn, SOut>
  ) {
    this._endpoints.push(endpoint)
    return this
  }
  collection<SIn extends TSchema>(collection: Collection<SIn>) {
    this._collections.push(collection)
    return this
  }
}

export function mergeScope(a: string, b: string) {
  if (!b.length) return a
  if (b.startsWith('.')) return b
  if (a === '.') return a + b
  return a + '.' + b
}

export function mergePath(a: string, b: string) {
  if (!b.length || b === '/') return a
  b = b.startsWith('/') ? b : '/' + b
  return a === '/' ? b : a + b
}

export function mergeSchema(a: TSchema | null, b: TSchema | null) {
  if (!(a && b)) return a || b
  if (a.type === 'object' && b.type === 'object')
    return Type.Intersect([a as any, b as any])
  throw new Error(`Cannot merge schema between ${a.type} and ${b.type}`)
}

function generateFastifySchema(TIn: TSchema, TOut: TSchema): FastifySchema {
  return {
    body: Type.Strict(TIn),
    response: {
      200: Type.Strict(
        Type.Object({
          ok: Type.Boolean(),
          r: Type.Optional(TOut),
          e: Type.Optional(Type.String())
        })
      )
    }
  }
}

function generateFastifyGetSchema(TIn: TSchema, TOut: TSchema): FastifySchema {
  return {
    querystring: Type.Strict(TIn),
    response: {
      200: Type.Strict(
        Type.Object({
          ok: Type.Boolean(),
          r: Type.Optional(TOut),
          e: Type.Optional(Type.String())
        })
      )
    }
  }
}

export function apply(root: Collection, server: FastifyInstance) {
  function applyEndpoint(
    endpoint: Endpoint,
    scope: string,
    path: string,
    schema: TSchema | null
  ) {
    scope = mergeScope(scope, endpoint._scope)
    path = mergePath(path, endpoint._path)
    schema = mergeSchema(schema, endpoint._TIn)!
    if (endpoint._method === 'GET') {
      server.route({
        method: 'GET',
        url: path,
        schema: generateFastifyGetSchema(schema, endpoint._TOut),
        handler: async (req, res) => {
          const ctx: IContext = {
            req,
            res,
            payload: req.query
          }
          try {
            const r = await Promise.resolve(endpoint._handler(ctx))
            return { ok: true, r }
          } catch (e) {
            return { ok: false, e: e.message }
          }
        }
      })
    } else {
      server.route({
        method: endpoint._method,
        url: path,
        schema: generateFastifySchema(schema, endpoint._TOut),
        handler: async (req, res) => {
          const ctx: IContext = {
            req,
            res,
            payload: req.body
          }
          try {
            const r = await Promise.resolve(endpoint._handler(ctx))
            return { ok: true, r }
          } catch (e) {
            return { ok: false, e: e.message }
          }
        }
      })
    }
  }
  function dfs(
    collection: Collection,
    scope: string,
    path: string,
    schema: TSchema | null
  ) {
    scope = mergeScope(scope, collection._scope)
    path = mergePath(path, collection._path)
    schema = mergeSchema(schema, collection._TIn)
    for (const endpoint of collection._endpoints) {
      applyEndpoint(endpoint, scope, path, schema)
    }
    collection._collections.forEach((x) => dfs(x, scope, path, schema))
  }
  dfs(root, '.', '/', null)
}
