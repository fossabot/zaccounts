import { AuthSysConfig } from '@/api/auth'
import { Collections } from '@/db'

export interface SysDocument {
  _id: string
  value: any
}

type SysKV = {
  ver: string
  auth: AuthSysConfig
}

export type SysKey = keyof SysKV

export async function setSys<K extends SysKey>(key: K, value: SysKV[K]) {
  await Collections.sys.updateOne(
    { _id: key },
    { $set: { value } },
    { upsert: true }
  )
}

export async function getSys<K extends SysKey>(key: K): Promise<SysKV[K]> {
  const record = await Collections.sys.findOne({ _id: key })
  if (!record) throw new Error('System not initialized')
  return record.value
}
