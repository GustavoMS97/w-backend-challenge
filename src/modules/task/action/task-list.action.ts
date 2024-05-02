import { Injectable } from '@nestjs/common'

import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { mapTaskListOutput, TaskListInput, TaskListOutput } from '@app/modules/task/contract/task-list.contract'
import { Task } from '@app/modules/task/task.entity'
import checkRawInput from '@app/shared/helpers/check-raw-input.helper'

@Injectable()
export class TaskListAction {
  constructor(private readonly taskMongooseRepository: TaskMongooseRepository) {}

  async handle(rawInput: TaskListInput): Promise<TaskListOutput[]> {
    const input = await checkRawInput(TaskListInput, rawInput)
    const tasks = await this.fetchTasks(input)

    const outputTasks = tasks.map((task) => mapTaskListOutput(task))
    return outputTasks
  }

  private async fetchTasks(input: TaskListInput): Promise<Task[]> {
    try {
      const tasks = await this.taskMongooseRepository.findByQuery(input)
      return tasks
    } catch (error) {
      throw new Error(`Unknown error during task query: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
    }
  }
}
