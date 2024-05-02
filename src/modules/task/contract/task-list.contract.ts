import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

import { TASK_STATUS } from '@app/modules/task/enum/task-status.enum'
import { mapTaskCreateOutput, TaskCreateOutput } from '@app/modules/task/contract/task-create.contract'

class TaskListInput {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEnum(TASK_STATUS)
  @ApiProperty({ description: 'Task status', enum: TASK_STATUS })
  status?: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Task priority level' })
  priority?: number
}

class TaskListOutput extends TaskCreateOutput {}

const mapTaskListOutput = mapTaskCreateOutput

export { TaskListInput, TaskListOutput, mapTaskListOutput }
