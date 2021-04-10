import { MongoClient } from 'mongodb'
import { Container } from '@/di'
import { SYM } from '@/symbols'
import { CollectionTypes, DocumentTypes, getCollection } from '@/db/cols'

export * from '@/db/cols'

export const Collections: CollectionTypes = {} as any

export async function setupMongo(mongoUrl: string, dbName: string) {
  const client = new MongoClient(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  await client.connect()
  const db = client.db(dbName)
  Container.provide(SYM.MONGO_CLIENT, client)
  Container.provide(SYM.DB, db)

  for (const name in DocumentTypes) {
    // @ts-ignore
    Collections[name] = getCollection(db, name)
  }
}
