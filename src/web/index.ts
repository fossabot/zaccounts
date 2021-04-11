import fastify from 'fastify'
import { PACKAGE } from '@/utils/package'
import { APIPlugin } from '@/api'
import { Logger } from '@/logger'

export async function startWebServer(
  listen: string,
  port: number,
  dev?: boolean
) {
  const server = fastify({ logger: Logger })

  if (dev) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    await server.register(require('fastify-swagger'), {
      swagger: {
        info: {
          title: 'Zccounts',
          description: 'ZZisu.DEV Account Hub',
          version: PACKAGE.version
        }
      },
      exposeRoute: true
    })
  }

  await server.register(APIPlugin)

  await server.listen(port, listen)
}
