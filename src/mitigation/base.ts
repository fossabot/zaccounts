import { APP_KEYS, getCollection } from '@/db'
import { Container } from '@/di'
import { SYM } from '@/symbols'
import { Db, MongoClient } from 'mongodb'
import { Logger } from 'pino'
import semver from 'semver'

type MitigationFn = (args: {
  client: MongoClient
  db: Db
  logger: Logger
}) => Promise<void>

const mitigations = new Map<string, MitigationFn>()

export function defineMitigation(version: string, fn: MitigationFn) {
  mitigations.set(version, fn)
}

export async function _runMitigations() {
  const client = await Container.get<MongoClient>(SYM.MONGO_CLIENT)
  const db = await Container.get<Db>(SYM.DB)
  const logger = await Container.get<Logger>(SYM.LOGGER)
  const app_col = getCollection(db, 'app')

  const M = [...mitigations.entries()]
  M.sort((a, b) => semver.compare(a[0], b[0]))

  for (const [ver, fn] of M) {
    const { value: cur } = (await app_col.findOne({ _id: APP_KEYS.ver }))!
    if (semver.lt(cur, ver)) {
      logger.info(`Mitigate from ${cur} to ${ver}`)
      await fn({ client, db, logger })
      await app_col.updateOne({ _id: APP_KEYS.ver }, { $set: { value: ver } })
    }
  }
}
