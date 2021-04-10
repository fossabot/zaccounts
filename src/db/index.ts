import { Db as _Db, MongoClient as _MongoClient } from 'mongodb'
import { CollectionTypes, DocumentTypes, getCollection } from '@/db/cols'

export * from '@/db/cols'

export const Collections: CollectionTypes = {} as any
export let MongoClient: _MongoClient
export let Db: _Db

export async function setupMongo(mongoUrl: string, dbName: string) {
  MongoClient = new _MongoClient(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  await MongoClient.connect()
  Db = MongoClient.db(dbName)

  for (const name in DocumentTypes) {
    // @ts-ignore
    Collections[name] = getCollection(Db, name)
  }
}
