import { HttpException, HttpStatus } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'

import isValidationErrorArray from '@app/shared/helpers/check-validation-error-array.helper'

export default async function checkRawInput<T extends object>(clss: new () => T, rawInput: T): Promise<T> {
  try {
    const input = plainToInstance(clss, rawInput, { enableImplicitConversion: true })
    await validateOrReject(input, { whitelist: true })
    return input
  } catch (error: unknown) {
    if (isValidationErrorArray(error)) {
      const errors = error.map((item) => Object.values(item.constraints ?? {})).flat()
      throw new HttpException({ errors }, HttpStatus.BAD_REQUEST, {
        cause: error
      })
    }
    // NOTE: Here, one thing I would implement to make this WAY better for error tracing is create a logger
    // shared in the application's container to throw this errors not meant for end-users into a log manager.
    throw new Error(`Unknown error during validation: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
  }
}
