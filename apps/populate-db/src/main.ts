import { MongoClient } from 'mongodb'
import {
  USER_COLLECTION_NAME,
  DATABASE_NAME,
  MONGO_DB_URL,
  LOAN_COLLECTION_NAME,
  REPAYMENT_COLLECTION_NAME,
} from './db-config'
import { loanFixtures } from './resources/loan.fixture'
import { userFixtures } from './resources/user.fixture'
import { repaymentFixtures } from './resources/repayment.fixture'

/**
 * Fill the database so that we can have some interesting tests over the development
 * In further operations, this can be recycle into integration tests
 */
async function populateDatabase() {
  const mongoDbUrl = process.env.MONGO_DB_URL ?? MONGO_DB_URL
  const databaseName = process.env.DB_NAME ?? DATABASE_NAME

  const client = new MongoClient(mongoDbUrl)

  try {
    await client.connect()

    const database = client.db(databaseName)
    const userCollection = database.collection(USER_COLLECTION_NAME)
    const loanCollection = database.collection(LOAN_COLLECTION_NAME)
    const repaymentCollection = database.collection(REPAYMENT_COLLECTION_NAME)

    await userCollection.deleteMany({})
    await loanCollection.deleteMany({})
    await repaymentCollection.deleteMany({})

    // Insert initial User data
    await userCollection.insertMany(userFixtures)
    await loanCollection.insertMany(loanFixtures)
    await repaymentCollection.insertMany(repaymentFixtures)

    console.log('Initial data inserted successfully.')
  } catch (error) {
    console.error('Error populating database:', error)
  } finally {
    await client.close()
  }
}

populateDatabase()
