import { Static, Type } from '@sinclair/typebox'

export const TError = Type.Object({
  n: Type.Integer(),
  m: Type.String()
})
export type TError = Static<typeof TError>
