import checkObjectId from '@app/shared/helpers/check-objectid-format.helper'

describe('checkObjectId', () => {
  it('should return true when a string is a valid mongoose object id', () => {
    expect(checkObjectId('6633e273f9fe75f4a575b1a4')).toStrictEqual(true)
  })

  it('should return false when a string is not a valid mongoose object id', () => {
    const wrapper = (): void => {
      checkObjectId('hi there!')
    }
    expect(wrapper).toThrow()
  })
})
