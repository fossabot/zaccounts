import { TSchema, TAny, Static, TNull } from '@sinclair/typebox'
import { Endpoint } from '@/api/core/endpoint'
import { Context } from '@/api/core/context'

export interface HubMiddleware<TIn extends TSchema = TNull> {
  (ctx: Context<Static<TIn>>): Promise<void> | void
}

export class Hub<TIn extends TSchema = TAny> {
  _path = '/'
  _scope = ''
  _endpoints: Endpoint<any, any>[] = []
  _collections: Hub<any>[] = []
  _TIn: TIn | null = null
  _middleware: HubMiddleware<TIn> | null = null

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
    return (this as any) as Hub<S>
  }

  middleware(middleware: HubMiddleware<TIn>) {
    this._middleware = middleware
    return this
  }

  endpoint<SIn extends TSchema, SOut extends TSchema>(
    endpoint: Endpoint<SIn, SOut>
  ) {
    this._endpoints.push(endpoint)
    return this
  }

  collection<SIn extends TSchema>(collection: Hub<SIn>) {
    this._collections.push(collection)
    return this
  }
}