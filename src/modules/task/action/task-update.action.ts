import { Injectable } from '@nestjs/common'

import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { mapTaskUpdateOutput, TaskUpdateInput, TaskUpdateOutput } from '@app/modules/task/contract/task-update.contract'
import { Task } from '@app/modules/task/task.entity'
import checkObjectId from '@app/shared/helpers/check-objectid-format.helper'
import checkRawInput from '@app/shared/helpers/check-raw-input.helper'

@Injectable()
export class TaskUpdateAction {
  constructor(private readonly taskMongooseRepository: TaskMongooseRepository) {}

  async handle(rawInput: TaskUpdateInput, taskId: string): Promise<TaskUpdateOutput> {
    checkObjectId(taskId)
    const input = await checkRawInput(TaskUpdateInput, rawInput)

    const taskData = Object.assign(new Task(), {
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: input.status
    })
    taskData.updatedAt = new Date()

    const updatedTask = await this.update(taskData, taskId)
    const output = mapTaskUpdateOutput(updatedTask)

    return output
  }

  private async update(task: Task, taskId: string): Promise<Task> {
    try {
      return await this.taskMongooseRepository.update({ _id: taskId }, task)
    } catch (error: unknown) {
      throw new Error(`Unknown error during task update: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
    }
  }
}
