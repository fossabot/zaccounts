import { SYS_KEYS, Collections } from '@/db'
import { Logger } from '@/logger'
import { _runMitigations } from '@/mitigation/base'

export async function runMitigations() {
  const sys_ver = await Collections.sys.findOne({ _id: SYS_KEYS.ver })

  if (sys_ver) {
    await _runMitigations()
  } else {
    Logger.error('Please initialize database first')
    process.exit(1)
  }
}
