import 'jest-matcher-specific-error'
import mongoose from 'mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpException, HttpStatus } from '@nestjs/common'

import { TaskDeleteAction } from '@app/modules/task/action/task-delete.action'
import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'

describe('TaskDeleteAction', () => {
  let taskDeleteAction: TaskDeleteAction
  let taskMongooseRepositoryMock: jest.Mocked<TaskMongooseRepository>

  const id = new mongoose.Types.ObjectId().toString()

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [TaskDeleteAction, { provide: TaskMongooseRepository, useValue: { remove: jest.fn() } }]
    }).compile()

    taskDeleteAction = app.get(TaskDeleteAction)
    taskMongooseRepositoryMock = app.get(TaskMongooseRepository)
  })

  it('should handle task delete with success', async () => {
    await expect(taskDeleteAction.handle(id)).resolves.toBeUndefined()
  })

  it('should throw an error when the repository fails to delete a task', async () => {
    const error = new Error('test')
    taskMongooseRepositoryMock.remove.mockRejectedValueOnce(error)
    await expect(taskDeleteAction.handle(id)).rejects.toEqual(
      new Error(`Unknown error during task delete: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
    )
  })

  it('should throw an error when an invalid id is sent', async () => {
    await expect(taskDeleteAction.handle('invalid id here! :)')).rejects.toMatchError(
      new HttpException({ errors: ['Invalid id format'] }, HttpStatus.BAD_REQUEST)
    )
  })
})
