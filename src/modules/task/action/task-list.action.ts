import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'

import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { mapTaskListOutput, TaskListInput, TaskListOutput } from '@app/modules/task/contract/task-list.contract'
import isValidationErrorArray from '@app/shared/helpers/check-validation-error-array.helper'
import { Task } from '@app/modules/task/task.entity'

@Injectable()
export class TaskListAction {
  constructor(private readonly taskMongooseRepository: TaskMongooseRepository) {}

  async handle(rawInput: TaskListInput): Promise<TaskListOutput[]> {
    const input = await this.checkRawInput(rawInput)
    const tasks = await this.fetchTasks(input)

    const outputTasks = tasks.map((task) => mapTaskListOutput(task))
    return outputTasks
  }

  private async fetchTasks(input: TaskListInput): Promise<Task[]> {
    try {
      const tasks = await this.taskMongooseRepository.findByQuery(input)
      return tasks
    } catch (error) {
      throw new Error(`Unknown error during task creation: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
    }
  }

  private async checkRawInput(rawInput: TaskListInput): Promise<TaskListInput> {
    try {
      const input = plainToInstance(TaskListInput, rawInput, { enableImplicitConversion: true })
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
}
