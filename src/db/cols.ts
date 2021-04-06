import { Db, ObjectId } from 'mongodb'

export type DocumentTypes = {
  sys: ISysDocument
  user: IUserDocument
  app: IAppDocument
}

export interface ISysDocument {
  _id: string
  value: any
}

export const SYS_KEYS = {
  ver: 'ver'
}

export interface IUserEmail {
  email: string
  verified: boolean
}

export interface IUserAppInfo {
  storage: Record<string, any>
  perms: Record<string, string[]>
}

export interface IUserDocument {
  _id: ObjectId
  name: string // username
  disp: string // nickname
  emails: IUserEmail[]
  apps: Record<string, IUserAppInfo>
}

export interface IAppPermission {
  name: string
  desc: string
}

export interface IAppDocument {
  _id: string // AppID must be string!
  name: string
  desc: string
  perms: IAppPermission[]
}

export function getCollection<T extends keyof DocumentTypes>(db: Db, name: T) {
  return db.collection<DocumentTypes[T]>(name)
}
