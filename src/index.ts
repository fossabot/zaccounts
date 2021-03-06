import './preload'

import yargs from 'yargs'
import { Logger, setupLogger } from '@/logger'
import { setupMongo } from '@/db'
import { runMitigations } from '@/mitigation'
import { runInit } from '@/init'
import { startWebServer } from '@/web'
import { setupRedis } from '@/cache'
import { setupAuthProviders } from '@/api/auth'

yargs
  .env('ZCT')
  .config('config', (path) => require(path))
  .option('dev', { type: 'boolean' })
  .option('slient', { type: 'boolean' })
  .option('verbose', { type: 'count', alias: ['v'] })
  .command(
    ['start', '$0'],
    'start zaccounts server',
    (yargs) =>
      yargs
        .option('port', { type: 'number', default: 3032 })
        .option('listen', { type: 'string', default: '127.0.0.1' })
        .option('mongoUrl', {
          type: 'string',
          default: 'mongodb://localhost:27017'
        })
        .option('redisUrl', {
          type: 'string',
          default: 'redis://127.0.0.1:6379/1'
        })
        .option('dbName', { type: 'string', default: 'zaccounts' }),
    async (argv) => {
      setupLogger(argv.dev, argv.slient, argv.verbose)
      await setupMongo(argv.mongoUrl, argv.dbName)
      await setupRedis(argv.redisUrl)

      await runMitigations()

      await setupAuthProviders()
      await startWebServer(argv.listen, argv.port, argv.dev)
      Logger.error(
        `MAIN\tZccounts server started on ${argv.listen}:${argv.port}`
      )
    }
  )
  .command(
    'init',
    'init zaccounts server',
    (yargs) =>
      yargs
        .option('mongoUrl', {
          type: 'string',
          default: 'mongodb://localhost:27017'
        })
        .option('dbName', { type: 'string', default: 'zaccounts' }),
    async (argv) => {
      setupLogger(argv.dev, argv.slient, argv.verbose)
      await setupMongo(argv.mongoUrl, argv.dbName)
      await runInit()
    }
  )
  .fail((msg, err) => {
    console.log(err)
    process.exit(1)
  }).argv
