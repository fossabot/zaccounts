import { Static, TSchema } from '@sinclair/typebox'

type MayPromise<T> = Promise<T> | T

export function defineAuthProvider<
  A extends TSchema,
  B extends TSchema,
  C extends TSchema,
  D extends TSchema,
  E extends TSchema,
  X extends TSchema,
  Y extends TSchema
>(provider: {
  TSys: A
  TLocal: B
  TVerify: C
  TUpdate: D
  TDetails: E
  verify: (s: Static<A>, l: Static<B>, r: Static<C>) => MayPromise<boolean>
  update: (
    s: Static<A>,
    l: Static<B> | null,
    r: Static<D>
  ) => MayPromise<Static<B>>
  details: (s: Static<A>, l: Static<B>) => MayPromise<Static<E>>
  action?: {
    TIn: X
    TOut: Y
    handler: (s: Static<A>, r: Static<X>) => MayPromise<Static<Y>>
  }
}) {
  return provider
}
