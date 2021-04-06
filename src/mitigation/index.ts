import { Db } from 'mongodb'
import { Logger } from 'pino'
import { SYS_KEYS, getCollection } from '@/db'
import { Container } from '@/di'
import { SYM } from '@/symbols'
import { _runMitigations } from '@/mitigation/base'

export async function runMitigations() {
  const logger = await Container.get<Logger>(SYM.LOGGER)
  const db = await Container.get<Db>(SYM.DB)
  const sys_col = getCollection(db, 'sys')
  const sys_ver = await sys_col.findOne({ _id: SYS_KEYS.ver })

  if (sys_ver) {
    await _runMitigations()
  } else {
    logger.error('Please initialize database first')
    process.exit(1)
  }
}
