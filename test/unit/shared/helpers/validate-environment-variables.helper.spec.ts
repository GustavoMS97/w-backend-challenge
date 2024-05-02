import { EnvironmentVariablesDto, validate } from '@app/shared/helpers/validate-environment-variables.helper'

describe('validate', () => {
  it('should return a valid environment variable config', () => {
    const expected = new EnvironmentVariablesDto()
    expected.ENVIRONMENT = 'test'
    expected.HOST_PORT = '3000'
    expected.MONGO_URL = 'MONGO_URL'
    expect(validate({ ENVIRONMENT: 'test', HOST_PORT: '3000', MONGO_URL: 'MONGO_URL' })).toStrictEqual(expected)
  })

  it('should throw an error when the config is not valid', () => {
    const wrapper = (): void => {
      validate({ ENVIRONMENT: 'test', HOST_PORT: '3000' })
    }
    expect(wrapper).toThrow()
  })
})
