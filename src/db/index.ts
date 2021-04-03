import { MongoClient } from 'mongodb'
import { Container } from '@/di'
import { SYM } from '@/symbols'

export * from '@/db/cols'

export async function setupDB(url: string, dbName: string) {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  await client.connect()
  const db = client.db(dbName)
  Container.provide(SYM.MONGO_CLIENT, client)
  Container.provide(SYM.DB, db)
}
