import { Static, TSchema } from '@sinclair/typebox'

export interface IAuthProvider<
  A extends TSchema,
  B extends TSchema,
  C extends TSchema,
  D extends TSchema,
  X extends TSchema,
  Y extends TSchema
  // eslint-disable-next-line prettier/prettier
  > {
  name: string

  TVerifyParams: A
  TDetails: B
  TUpdateParams: C
  TLocal: D

  verify(r: Static<A>, l: Static<D>): Promise<boolean>
  details(): Promise<Static<B>>
  update(r: Static<C>): Promise<Static<D>>
  action?: {
    TReq: X
    TRes: Y
    handle(r: X): Promise<Y>
  }
}

export const AuthProviders: IAuthProvider<any, any, any, any, any, any>[] = []

export function addAuthProvider<
  A extends TSchema,
  B extends TSchema,
  C extends TSchema,
  D extends TSchema,
  X extends TSchema,
  Y extends TSchema
>(provider: IAuthProvider<A, B, C, D, X, Y>) {
  AuthProviders.push(provider)
}
