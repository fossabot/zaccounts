import { Db } from 'mongodb'

export type DocumentTypes = {
  app: IAPPDocument
}

export interface IAPPDocument {
  _id: string
  value: any
}

export const APP_KEYS = {
  ver: 'ver'
}

export function getCollection(db: Db, name: keyof DocumentTypes) {
  return db.collection<DocumentTypes[typeof name]>(name)
}
