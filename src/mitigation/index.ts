import { Db } from 'mongodb'
import { Logger } from 'pino'
import { APP_KEYS, getCollection } from '@/db'
import { Container } from '@/di'
import { SYM } from '@/symbols'
import { _runMitigations } from '@/mitigation/base'

export async function runMitigations() {
  const logger = await Container.get<Logger>(SYM.LOGGER)
  const db = await Container.get<Db>(SYM.DB)
  const app_col = getCollection(db, 'app')
  const app_ver = await app_col.findOne({ _id: APP_KEYS.ver })

  if (app_ver) {
    await _runMitigations()
  } else {
    logger.error('Please initialize database first')
    process.exit(1)
  }
}
