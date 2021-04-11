import { Context } from '@/api/core/context'
import { Cast, OptionalSchema } from '@/api/core/utils'
import { MayPromise } from '@/utils/types'

export interface IEndpointHandler<
  TIn extends OptionalSchema,
  TOut extends OptionalSchema
> {
  (ctx: Context<Cast<TIn>>): MayPromise<Cast<TOut>>
}

const defaultHandler = async () => {
  throw new Error('Not implemented')
}

type HTTPMethod = 'GET' | 'POST'

export class Endpoint<
  TIn extends OptionalSchema = null,
  TOut extends OptionalSchema = null
> {
  _path = ''
  _method: HTTPMethod = 'POST'
  _scope = ''
  _handler: IEndpointHandler<TIn, TOut> = defaultHandler
  _TIn: TIn = null as TIn
  _TOut: TOut = null as TOut
  _raw = false

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

  input<S extends OptionalSchema>(schema: S) {
    this._TIn = schema as any
    return (this as any) as Endpoint<S, TOut>
  }
  output<S extends OptionalSchema>(schema: S) {
    this._TOut = schema as any
    return (this as any) as Endpoint<TIn, S>
  }
  raw() {
    this._TOut = null as TOut
    this._raw = true
    return (this as any) as Endpoint<TIn, null>
  }

  handler(handler: IEndpointHandler<TIn, TOut>) {
    this._handler = handler
    return this
  }
}
