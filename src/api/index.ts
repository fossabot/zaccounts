import { Type } from '@sinclair/typebox'
import { Hub, Endpoint, generateFastifyPlugin } from '@/api/core'
import { Collections } from '@/db'
import { generateUserToken } from '@/api/core'

const APIRoot = new Hub()
  .middleware(async () => {
    // await ratelimit())
  })
  .endpoint(
    new Endpoint()
      .path('/login')
      .input(
        Type.Object({
          name: Type.String(),
          cred: Type.Object({}, { minProperties: 1, maxProperties: 2 })
        })
      )
      .output(Type.String())
      .handler(async (ctx) => {
        const user = await Collections.users.findOne({ name: ctx.payload.name })
        if (!user) throw new Error('Not found')
        return generateUserToken(user._id)
      })
  )

export const APIPlugin = generateFastifyPlugin(APIRoot)
