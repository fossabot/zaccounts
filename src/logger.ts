import pino, { Logger } from 'pino'
import { Container } from '@/di'
import { SYM } from '@/symbols'

export let logger: Logger

export function setupLogger(
  dev: boolean | undefined,
  slient: boolean | undefined,
  level: number
) {
  const _logger = pino({
    prettyPrint: dev,
    level: (() => {
      if (slient) return 'slient'
      switch (level) {
        case 1:
          return 'warn'
        case 3:
          return 'info'
        case 4:
          return 'debug'
        case 5:
          return 'trace'
      }
      return dev ? 'info' : 'error'
    })()
  })
  Container.provide(SYM.LOGGER, _logger)
  logger = _logger
  return _logger
}
