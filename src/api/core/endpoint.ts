import { TSchema, TNull, Static, TObject, Type, TAny } from '@sinclair/typebox'
import { Context } from '@/api/core/context'

export interface IEndpointHandler<
  TIn extends TSchema = TNull,
  TOut extends TSchema = TNull
> {
  (ctx: Context<Static<TIn>>): Promise<Static<TOut>> | Static<TOut>
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
  _path = ''
  _method: HTTPMethod = 'POST'
  _scope = ''
  _handler: IEndpointHandler<TIn, TOut> = defaultHandler
  _TIn: TIn = Type.Object({}) as TIn
  _TOut: TOut = Type.Null() as TOut
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

  input<S extends TSchema>(schema: S) {
    this._TIn = schema as any
    return (this as any) as Endpoint<S, TOut>
  }
  output<S extends TSchema>(schema: S) {
    this._TOut = schema as any
    return (this as any) as Endpoint<TIn, S>
  }
  raw() {
    this._TOut = Type.Any() as any
    this._raw = true
    return (this as any) as Endpoint<TIn, TAny>
  }

  handler(handler: IEndpointHandler<TIn, TOut>) {
    this._handler = handler
    return this
  }
}
