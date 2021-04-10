import { Db, MongoClient, getSys, setSys } from '@/db'
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
    const cur = await getSys('ver')
    if (semver.lt(cur, ver)) {
      Logger.info(`Mitigate from ${cur} to ${ver}`)
      await fn({ client: MongoClient, db: Db, logger: Logger })
      await setSys('ver', ver)
    }
  }
}
