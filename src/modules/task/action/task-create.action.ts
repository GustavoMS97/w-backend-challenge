import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'

import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { Task } from '@app/modules/task/task.entity'
import { TASK_STATUS } from '@app/modules/task/enum/task-status.enum'
import { TaskCreateInput, TaskCreateOutput, mapTaskCreateOutput } from '@app/modules/task/contract/task-create.contract'
import isValidationErrorArray from '@app/shared/helpers/check-validation-error-array.helper'

@Injectable()
export class TaskCreateAction {
  constructor(private readonly taskMongooseRepository: TaskMongooseRepository) {}

  async handle(rawInput: TaskCreateInput): Promise<TaskCreateOutput> {
    const input = await this.checkRawInput(rawInput)

    const taskData = new Task()
    taskData.title = input.title
    taskData.description = input.description
    taskData.priority = input.priority
    taskData.status = TASK_STATUS.PENDING

    const task = await this.create(taskData)
    const output = mapTaskCreateOutput(task)

    return output
  }

  private async checkRawInput(rawInput: TaskCreateInput): Promise<TaskCreateInput> {
    try {
      const input = plainToInstance(TaskCreateInput, rawInput)
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

  private async create(input: Task): Promise<Task> {
    try {
      return await this.taskMongooseRepository.create(input)
    } catch (error: unknown) {
      throw new Error(`Unknown error during task creation: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
    }
  }
}
