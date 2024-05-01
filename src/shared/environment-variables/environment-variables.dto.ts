import { Expose } from 'class-transformer'
import { IsEnum, IsPort, IsString } from 'class-validator'

import { NODE_ENV } from '@app/shared/environment-variables/enum/node-env.enum'

export default class EnvironmentVariablesDto {
  @Expose()
  @IsString()
  @IsEnum(NODE_ENV)
  ENVIRONMENT: string

  @Expose()
  @IsPort()
  HOST_PORT: string

  @Expose()
  @IsString()
  MONGO_URL: string
}
