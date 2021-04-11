import format from 'pretty-ms'
import * as uuid from 'uuid'
import { Collections, MongoClient, getSys, setSys, Db } from '@/db'
import { confirm } from '@/utils/prompts'
import { MAGICS } from '@/magics'
import { Logger } from '@/logger'
import { PassAuth } from '@/api/auth/pass'

async function setSelfApp() {
  await Collections.apps.insertOne({
    _id: MAGICS.appId,
    name: 'ZZisu.dev Accounts',
    desc: 'ZZisu.dev Account Manager',
    perms: []
  })
}

async function setAdminUser() {
  const result = await Collections.users.insertOne({
    _id: uuid.v4(),
    name: 'admin',
    disp: 'Admin',
    emails: 'i@zzs1.cn',
    cred: {},
    require2FA: false,
    apps: {}
  })
  return result.insertedId
}

export async function runInit() {
  const sys_ver = await getSys('ver')

  if (sys_ver) {
    if (!(await confirm('App is initialized. Perform reinit?'))) {
      process.exit(0)
    }
  }

  const start = Date.now()
  Logger.info('INIT\tInitializing application...')

  // BEGIN Application initialize

  await Db.dropDatabase()
  await setSys('ver', '0.0.0')
  await setSys('auth', {
    pass: { enabled: true, config: {} },
    dummy: { enabled: true, config: {} }
  })
  await setSelfApp()
  const user = await setAdminUser()
  await Collections.users.updateOne(
    {
      _id: user
    },
    {
      $set: {
        'cred.pass': await PassAuth.update({}, null, { pass: 'adminadmin' })
      }
    }
  )

  // END Application initialize

  Logger.info(`INIT\tApp initialized in ${format(Date.now() - start)}`)
  await MongoClient.close()
  process.exit(0)
}
