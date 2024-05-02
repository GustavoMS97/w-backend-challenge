import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

import { TASK_STATUS } from '@app/modules/task/enum/task-status.enum'
import { mapTaskCreateOutput, TaskCreateOutput } from '@app/modules/task/contract/task-create.contract'

class TaskUpdateInput {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => String(value).trim())
  @ApiProperty({ description: 'Task title' })
  title?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => String(value).trim())
  @ApiProperty({ description: 'Task description' })
  description?: string

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Task priority level' })
  priority?: number

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEnum(TASK_STATUS)
  @ApiProperty({ description: 'Task status', enum: TASK_STATUS })
  status?: string
}

class TaskUpdateOutput extends TaskCreateOutput {}

const mapTaskUpdateOutput = mapTaskCreateOutput

export { TaskUpdateInput, TaskUpdateOutput, mapTaskUpdateOutput }
