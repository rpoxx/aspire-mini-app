import { Application } from 'express'
import { MongoClient } from 'mongodb'
import { LOCAL_MONGO_DB_URL } from '../config/local-db.config'
import { DATABASE_NAME } from './database.constants'

/**
 * Create a connection to the database
 * @returns : database connection
 */
export async function createDbConnection(app: Application): Promise<void> {
  // Config
  const mongoUrl = process.env.MONGO_DB_URL ?? LOCAL_MONGO_DB_URL

  // MongoDb connection
  const client = new MongoClient(mongoUrl)
  await client.connect()
  const db = await client.db(DATABASE_NAME)
  console.log('Connected to MongoDB')
  // Attach database connection to app object
  app.locals.db = db
}
