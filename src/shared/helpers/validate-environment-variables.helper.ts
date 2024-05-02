import { Expose, plainToInstance } from 'class-transformer'
import { IsEnum, IsPort, IsString, validateSync } from 'class-validator'

export enum NODE_ENV {
  DEV = 'dev',
  TEST = 'test',
  PRD = 'prd'
}

export class EnvironmentVariablesDto {
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

export function validate(config: Record<string, unknown>): EnvironmentVariablesDto {
  const validatedConfig = plainToInstance(EnvironmentVariablesDto, config, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true
  })
  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
