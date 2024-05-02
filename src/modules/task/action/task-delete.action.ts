import { Injectable } from '@nestjs/common'

import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import checkObjectId from '@app/shared/helpers/check-objectid-format.helper'

@Injectable()
export class TaskDeleteAction {
  constructor(private readonly taskMongooseRepository: TaskMongooseRepository) {}

  async handle(taskId: string): Promise<void> {
    checkObjectId(taskId)
    await this.delete(taskId)
    return
  }

  private async delete(taskId: string): Promise<void> {
    try {
      await this.taskMongooseRepository.remove({ _id: taskId })
    } catch (error: unknown) {
      throw new Error(`Unknown error during task delete: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
    }
  }
}
