const teardownMongoDatabase = async (): Promise<void> => {
  await global.__MONGOD__.stop()
  console.log('Stop mongo mock')
}

const teardown = async (): Promise<void> => {
  await teardownMongoDatabase()
}

export default teardown
