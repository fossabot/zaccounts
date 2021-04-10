import pino from 'pino'

export let Logger: pino.Logger

export function setupLogger(
  dev: boolean | undefined,
  slient: boolean | undefined,
  level: number
) {
  Logger = pino({
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
}
