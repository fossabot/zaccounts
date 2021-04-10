import { Collection, Db } from 'mongodb'
import { SysDocument } from '@/db/collections/sys'
import { UserDocument } from '@/db/collections/user'
import { AppDocument } from '@/db/collections/app'
import { TokenDocument } from '@/db/collections/token'

export * from '@/db/collections/sys'
export * from '@/db/collections/user'
export * from '@/db/collections/app'
export * from '@/db/collections/token'

export const DocumentTypes = {
  sys: {} as SysDocument,
  users: {} as UserDocument,
  apps: {} as AppDocument,
  tokens: {} as TokenDocument
}

export type DocumentTypes = typeof DocumentTypes
export type CollectionTypes = {
  [key in keyof DocumentTypes]: Collection<DocumentTypes[key]>
}

export function getCollection<T extends keyof DocumentTypes>(db: Db, name: T) {
  return db.collection<DocumentTypes[T]>(name)
}
