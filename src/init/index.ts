import format from 'pretty-ms'
import { SYS_KEYS, Collections, MongoClient } from '@/db'
import { confirm } from '@/utils/prompts'
import { MAGICS } from '@/magics'
import { Logger } from '@/logger'

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
  const sys_ver = await Collections.sys.findOne({ _id: SYS_KEYS.ver })

  if (sys_ver) {
    if (!(await confirm('App is initialized. Perform reinit?'))) {
      process.exit(0)
    }
  }

  const start = Date.now()
  Logger.info('Initializing application...')

  // BEGIN Application initialize

  await setAppVer('0.0.0')
  await setSelfApp()

  // END Application initialize

  Logger.info(`App initialized in ${format(Date.now() - start)}`)
  await MongoClient.close()
  process.exit(0)
}
