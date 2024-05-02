import { Injectable } from '@nestjs/common'

import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { Task } from '@app/modules/task/task.entity'
import { TASK_STATUS } from '@app/modules/task/enum/task-status.enum'
import { TaskCreateInput, TaskCreateOutput, mapTaskCreateOutput } from '@app/modules/task/contract/task-create.contract'
import checkRawInput from '@app/shared/helpers/check-raw-input.helper'

@Injectable()
export class TaskCreateAction {
  constructor(private readonly taskMongooseRepository: TaskMongooseRepository) {}

  async handle(rawInput: TaskCreateInput): Promise<TaskCreateOutput> {
    const input = await checkRawInput(TaskCreateInput, rawInput)

    const taskData = new Task()
    taskData.title = input.title
    taskData.description = input.description
    taskData.priority = input.priority
    taskData.status = TASK_STATUS.PENDING

    const task = await this.create(taskData)
    const output = mapTaskCreateOutput(task)

    return output
  }

  private async create(input: Task): Promise<Task> {
    try {
      return await this.taskMongooseRepository.create(input)
    } catch (error: unknown) {
      throw new Error(`Unknown error during task creation: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
    }
  }
}
