/* eslint-disable import/no-relative-parent-imports */
import { MongoMemoryServer } from 'mongodb-memory-server'

import { NODE_ENV } from '../../src/shared/helpers/validate-environment-variables.helper'

const mockMongoDatabase = async (): Promise<string> => {
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  global.__MONGOD__ = mongod
  return uri
}

const envSetup = (mongoDns: string): void => {
  process.env.ENVIRONMENT = NODE_ENV.TEST
  process.env.PORT = '3000'
  process.env.MONGO_URL = mongoDns
}

const setup = async (): Promise<void> => {
  const mongoDns = await mockMongoDatabase()
  envSetup(mongoDns)
}

export default setup
