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
  .endpoint((endpoint) =>
    endpoint
      .method('GET')
      .path('/raw')
      .raw()
      .handler(() => 'hello')
  )
  .endpoint((e) =>
    e
      .method('GET')
      .path('err')
      .handler(() => {
        throw new Error('1')
      })
  )
  .endpoint((e) =>
    e
      .path('rawerr')
      .method('GET')
      .raw()
      .handler(() => {
        throw new Error('2')
      })
  )

export const APIPlugin = generateFastifyPlugin(APIRoot)
