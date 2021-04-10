import { SYS_KEYS, Db, MongoClient, Collections } from '@/db'
import { Logger } from '@/logger'
import semver from 'semver'

type MitigationFn = (args: {
  client: typeof MongoClient
  db: typeof Db
  logger: typeof Logger
}) => Promise<void>

const mitigations = new Map<string, MitigationFn>()

export function defineMitigation(version: string, fn: MitigationFn) {
  mitigations.set(version, fn)
}

export async function _runMitigations() {
  const M = [...mitigations.entries()]
  M.sort((a, b) => semver.compare(a[0], b[0]))

  for (const [ver, fn] of M) {
    const { value: cur } = (await Collections.sys.findOne({
      _id: SYS_KEYS.ver
    }))!
    if (semver.lt(cur, ver)) {
      Logger.info(`Mitigate from ${cur} to ${ver}`)
      await fn({ client: MongoClient, db: Db, logger: Logger })
      await Collections.sys.updateOne(
        { _id: SYS_KEYS.ver },
        { $set: { value: ver } }
      )
    }
  }
}
