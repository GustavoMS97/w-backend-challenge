import { ValidationError } from 'class-validator'

import isValidationErrorArray from '@app/shared/helpers/check-validation-error-array.helper'

describe('isValidationErrorArray', () => {
  it('should return true when an array of validation error is identified', () => {
    const errors = [new ValidationError(), new ValidationError()]
    expect(isValidationErrorArray(errors)).toStrictEqual(true)
  })

  it('should return false when a generic error is thrown', () => {
    expect(isValidationErrorArray(new Error('test'))).toStrictEqual(false)
  })

  it('should return true only when the whole array is composed by validation errors', () => {
    const errors = [new ValidationError(), new Error()]
    expect(isValidationErrorArray(errors)).toStrictEqual(false)
  })
})
