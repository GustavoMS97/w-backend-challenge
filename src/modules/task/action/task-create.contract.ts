import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

import { TASK_STATUS } from '@app/modules/task/enum/task-status.enum'
import { Task } from '@app/modules/task/task.entity'

class TaskCreateInput {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => String(value).trim())
  @ApiProperty({ description: 'Task title' })
  title: string

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => String(value).trim())
  @ApiProperty({ description: 'Task description' })
  description: string

  @IsNumber()
  @ApiProperty({ description: 'Task priority level' })
  priority: number
}

class TaskCreateOutput {
  @Expose()
  @ApiProperty({ description: 'Task identifier' })
  id: string

  @Expose()
  @ApiProperty({ description: 'Task Title' })
  title: string

  @Expose()
  @ApiProperty({ description: 'Task description' })
  description: string

  @Expose()
  @ApiProperty({ description: 'Task priority level' })
  priority: number

  @Expose()
  @ApiProperty({ description: 'Task current status', enum: TASK_STATUS })
  status: string

  @Expose()
  @ApiProperty({ description: 'Task creation date' })
  createdAt: Date

  @Expose()
  @ApiProperty({ description: 'Task update date' })
  updatedAt: Date
}

function mapTaskCreateOutput(data: Task): TaskCreateOutput {
  return {
    id: data._id.toString(),
    title: data.title,
    description: data.description,
    priority: data.priority,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }
}

export { TaskCreateInput, TaskCreateOutput, mapTaskCreateOutput }
