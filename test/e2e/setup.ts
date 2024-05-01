/* eslint-disable import/no-relative-parent-imports */
import { MongoMemoryServer } from 'mongodb-memory-server'

import { NODE_ENV } from '../../src/shared/environment-variables/enum/node-env.enum'

const mockMongoDatabase = async (): Promise<string> => {
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  global.__MONGOD__ = mongod
  return uri
}

const envSetup = (mongoDns: string): void => {
  process.env.NODE_ENV = NODE_ENV.TEST
  process.env.MONGO_DB_URL = mongoDns
}

const setup = async (): Promise<void> => {
  const mongoDns = await mockMongoDatabase()
  envSetup(mongoDns)
}

export default setup
