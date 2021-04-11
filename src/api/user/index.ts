import { Endpoint, Hub } from '@/api/core'
import { Collections } from '@/db'
import { Type } from '@sinclair/typebox'
import { SameUser } from '@/api/middleware'
import { HasUser } from '@/api/schema'

export const UserRoot = new Hub()
  .scope('user')
  .path('user')
  .input(HasUser)
  .middleware(SameUser)
  .endpoint(
    new Endpoint()
      .method('GET')
      .input(HasUser)
      .output(Type.Any())
      .handler(async (ctx) => {
        const user = await Collections.users.findOne(
          { _id: ctx.payload.user },
          { projection: { cred: 0 } }
        )
        return user
      })
  )
