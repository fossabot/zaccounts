import { MongoClient } from 'mongodb'
import { Logger } from 'pino'
import format from 'pretty-ms'
import { SYS_KEYS, Collections } from '@/db'
import { Container } from '@/di'
import { SYM } from '@/symbols'
import { confirm } from '@/utils/prompts'
import { MAGICS } from '@/magics'

async function setAppVer(ver: string) {
  await Collections.sys.updateOne(
    { _id: SYS_KEYS.ver },
    { $set: { value: ver } },
    { upsert: true }
  )
}

async function setSelfApp() {
  await Collections.apps.insertOne({
    _id: MAGICS.appId,
    name: 'ZZisu.dev Accounts',
    desc: 'ZZisu.dev Account Manager',
    perms: []
  })
}

export async function runInit() {
  const logger = await Container.get<Logger>(SYM.LOGGER)
  const client = await Container.get<MongoClient>(SYM.MONGO_CLIENT)
  const sys_ver = await Collections.sys.findOne({ _id: SYS_KEYS.ver })

  if (sys_ver) {
    if (!(await confirm('App is initialized. Perform reinit?'))) {
      process.exit(0)
    }
  }

  const start = Date.now()
  logger.info('Initializing application...')

  // BEGIN Application initialize

  await setAppVer('0.0.0')
  await setSelfApp()

  // END Application initialize

  logger.info(`App initialized in ${format(Date.now() - start)}`)
  await client.close()
  process.exit(0)
}
