import { Type } from '@sinclair/typebox'
import { Hub, Endpoint, generateFastifyPlugin } from '@/api/core'
import { UserRoot } from '@/api/user'
import { AuthRoot } from '@/api/auth'

const APIRoot = new Hub()
  .hub(AuthRoot)
  .hub(UserRoot)
  .endpoint(
    new Endpoint()
      .method('GET')
      .input(Type.Object({}))
      .output(
        Type.Object({
          doc: Type.String()
        })
      )
      .handler(() => {
        return { doc: 'http://127.0.0.1:3032/documentation' }
      })
  )

export const APIPlugin = generateFastifyPlugin(APIRoot)
