import mongoose from 'mongoose'

import { mapTaskCreateOutput, TaskCreateOutput } from '@app/modules/task/contract/task-create.contract'
import { TASK_STATUS } from '@app/modules/task/enum/task-status.enum'
import { Task } from '@app/modules/task/task.entity'

describe('mapTaskCreateOutput', () => {
  it('should map a Task to TaskCreateOutput', () => {
    const task = new Task()
    task._id = new mongoose.Types.ObjectId()
    task.title = 'test'
    task.description = 'description'
    task.priority = 3
    task.status = TASK_STATUS.PENDING
    task.createdAt = new Date()
    task.updatedAt = new Date()
    const expected = Object.assign(new TaskCreateOutput(), {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    })
    expect(mapTaskCreateOutput(task)).toEqual(expected)
  })
})
