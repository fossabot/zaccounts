import { getSys } from '@/db'
import { Logger } from '@/logger'
import { _runMitigations } from '@/mitigation/base'

export async function runMitigations() {
  const sys_ver = await getSys('ver')

  if (sys_ver) {
    await _runMitigations()
  } else {
    Logger.error('MITIGATE\tPlease initialize database first')
    process.exit(1)
  }
}
