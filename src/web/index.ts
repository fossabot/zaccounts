import fastify from 'fastify'
import { Logger } from 'pino'
import { Container } from '@/di'
import { SYM } from '@/symbols'
import { apply } from '@/api/base'
import { APIRoot } from '@/api'
import { PACKAGE } from '@/utils/package'

export async function startWebServer(
  listen: string,
  port: number,
  dev?: boolean
) {
  const logger = await Container.get<Logger>(SYM.LOGGER)
  const server = fastify({ logger })

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

  apply(APIRoot, server)

  await server.listen(port, listen)
  console.log(server.printRoutes())
}
