import { Db, MongoClient } from 'mongodb'
import { Logger } from 'pino'
import { APP_KEYS, getCollection } from '@/db'
import { Container } from '@/di'
import { SYM } from '@/symbols'
import { confirm } from '@/utils/prompts'
import format from 'pretty-ms'

export async function runInit() {
  const logger = await Container.get<Logger>(SYM.LOGGER)
  const db = await Container.get<Db>(SYM.DB)
  const client = await Container.get<MongoClient>(SYM.MONGO_CLIENT)
  const app_col = getCollection(db, 'app')
  const app_ver = await app_col.findOne({ _id: APP_KEYS.ver })

  if (app_ver) {
    if (!(await confirm('App is initialized. Perform reinit?'))) {
      process.exit(0)
    }
  }

  async function setAppVer(ver: string) {
    await app_col.updateOne(
      { _id: APP_KEYS.ver },
      { $set: { value: ver } },
      { upsert: true }
    )
  }

  const start = Date.now()
  logger.info('Initializing application...')

  // BEGIN Application initialize

  await setAppVer('0.0.0')

  // END Application initialize

  logger.info(`App initialized in ${format(Date.now() - start)}`)
  await client.close()
  process.exit(0)
}
