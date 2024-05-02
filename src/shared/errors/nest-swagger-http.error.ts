import { ApiProperty } from '@nestjs/swagger'

// 400
export class BadRequestError {
  @ApiProperty({
    description: 'Error message array'
  })
  errors: string[]
}

// 500
export class InternalServerError {
  @ApiProperty({
    description: 'Error status code'
  })
  statusCode: number

  @ApiProperty({
    description: 'Error message'
  })
  message: string
}
