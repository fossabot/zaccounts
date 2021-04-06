import fastify from 'fastify'
import { Logger } from 'pino'
import { Container } from '@/di'
import { SYM } from '@/symbols'

export async function startWebServer(listen: string, port: number) {
  const logger = await Container.get<Logger>(SYM.LOGGER)
  const server = fastify({ logger })

  await server.listen(port, listen)
}
