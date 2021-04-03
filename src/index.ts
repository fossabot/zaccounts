import './preload'

import yargs from 'yargs'
import { setupLogger } from '@/logger'
import { setupDB } from '@/db'
import { runMitigations } from '@/mitigation'
import { runInit } from '@/init'

yargs
  .env('ZCT')
  .config('config', (path) => require(path))
  .option('dev', { type: 'boolean' })
  .option('slient', { type: 'boolean' })
  .option('verbose', { type: 'count', alias: ['v'] })
  .command(
    ['start', '$0'],
    'start zccounts server',
    (yargs) =>
      yargs
        .option('port', { type: 'number', default: 3032 })
        .option('listen', { type: 'string', default: '127.0.0.1' })
        .option('dbUrl', {
          type: 'string',
          default: 'mongodb://localhost:27017'
        })
        .option('dbName', { type: 'string', default: 'zccounts' }),
    async (argv) => {
      setupLogger(argv.dev, argv.slient, argv.verbose)
      await setupDB(argv.dbUrl, argv.dbName)
      await runMitigations()
      console.log(argv)
    }
  )
  .command(
    'init',
    'init zccounts server',
    (yargs) =>
      yargs
        .option('dbUrl', {
          type: 'string',
          default: 'mongodb://localhost:27017'
        })
        .option('dbName', { type: 'string', default: 'zccounts' }),
    async (argv) => {
      setupLogger(argv.dev, argv.slient, argv.verbose)
      await setupDB(argv.dbUrl, argv.dbName)
      await runInit()
    }
  )
  .fail((msg, err) => {
    console.log(err)
    process.exit(1)
  }).argv
