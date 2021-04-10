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
      .output(Type.String())
      .handler(() => 'Hello')
  )

export const APIPlugin = generateFastifyPlugin(APIRoot)
