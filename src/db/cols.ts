import { Collection, Db } from 'mongodb'

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

export interface SysDocument {
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

export interface IUserCred {
  pass?: {
    hash: string
    salt: string
  }
}

export interface IUserAltCred {
  email?: string
}

export interface UserDocument {
  _id: string
  name: string // username
  disp: string // nickname
  emails: IUserEmail[]
  cred: IUserCred
  altCred: IUserAltCred
  require2FA: boolean

  apps: Record<string, IUserAppInfo>
}

export interface IAppPermission {
  name: string
  desc: string
}

export interface AppDocument {
  _id: string // AppID must be string!
  name: string
  desc: string
  perms: IAppPermission[]
}

export interface UserTokenDocument {
  _id: string
  user: string
  type: 'user'
  admin?: boolean
}

export interface AppTokenDocument {
  _id: string
  user: string
  app: string
  type: 'app'
}

export type TokenDocument = UserTokenDocument | AppTokenDocument

export function getCollection<T extends keyof DocumentTypes>(db: Db, name: T) {
  return db.collection<DocumentTypes[T]>(name)
}
