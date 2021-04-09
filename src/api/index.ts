import { Collection, Endpoint } from '@/api/base'
import { Type } from '@sinclair/typebox'

export const APIRoot = new Collection()
  .endpoint(
    new Endpoint()
      .method('GET')
      .output(Type.String())
      .handler((ctx) => {
        return ctx.req.ip
      })
  )
  .endpoint(
    new Endpoint()
      .method('GET')
      .path('/add')
      .input(Type.Object({ a: Type.Number(), b: Type.Number() }))
      .output(Type.Number())
      .handler(async (ctx) => ctx.payload.a + ctx.payload.b)
  )
  .endpoint(
    new Endpoint()
      .method('GET')
      .path('/err')
      .input(Type.Object({ a: Type.Number(), b: Type.Number() }))
      .output(Type.Number())
      .handler(async () => {
        throw new Error('Ouch')
      })
  )
  .collection(
    new Collection()
      .path('sub')
      .input(Type.Object({ id: Type.String() }))
      .endpoint(
        new Endpoint()
          .path('/test')
          .input(Type.Object({}))
          .output(Type.String())
          .handler(async (ctx) => (ctx.payload as any).id)
      )
  )
