import { Test, TestingModule } from '@nestjs/testing'
import mongoose from 'mongoose'
import { ValidationError } from 'class-validator'
import { HttpException, HttpStatus } from '@nestjs/common'

import { TaskUpdateAction } from '@app/modules/task/action/task-update.action'
import { TaskUpdateInput, TaskUpdateOutput } from '@app/modules/task/contract/task-update.contract'
import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { Task } from '@app/modules/task/task.entity'

describe('TaskUpdateAction', () => {
  let taskUpdateAction: TaskUpdateAction
  let taskMongooseRepositoryMock: jest.Mocked<TaskMongooseRepository>

  const input = Object.assign(new TaskUpdateInput(), {
    title: 'new title',
    description: 'test description',
    priority: 10,
    status: 'completed'
  })

  const id = new mongoose.Types.ObjectId().toString()

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [TaskUpdateAction, { provide: TaskMongooseRepository, useValue: { update: jest.fn().mockResolvedValue(new Task()) } }]
    }).compile()

    taskUpdateAction = app.get(TaskUpdateAction)
    taskMongooseRepositoryMock = app.get(TaskMongooseRepository)
  })

  it('should handle task update with success', async () => {
    const output = new TaskUpdateOutput()
    await expect(taskUpdateAction.handle(input, id)).resolves.toEqual(output)
  })

  it('should throw an error when the repository fails to update a task', async () => {
    const error = new Error('test')
    taskMongooseRepositoryMock.update.mockRejectedValueOnce(error)
    await expect(taskUpdateAction.handle(input, id)).rejects.toEqual(
      new Error(`Unknown error during task update: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
    )
  })

  it('should throw an error when the validation fails with generic error', async () => {
    const error = new Error('test')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mock = jest.spyOn(require('class-validator'), 'validateOrReject')
    mock.mockRejectedValueOnce(error)
    await expect(taskUpdateAction.handle(input, id)).rejects.toEqual(
      new Error(`Unknown error during validation: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
    )
    mock.mockRestore()
  })

  it('should throw an error when the validation fails an array of validation errors', async () => {
    const error = new ValidationError()
    error.constraints = {
      test: 'this is an error message'
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mock = jest.spyOn(require('class-validator'), 'validateOrReject')
    mock.mockRejectedValueOnce([error])
    const expected = new HttpException({ errors: ['this is an error message'] }, HttpStatus.BAD_REQUEST, {
      cause: [error]
    })
    await expect(taskUpdateAction.handle(input, id)).rejects.toEqual(expected)
    mock.mockRestore()
  })

  it('should throw an error when the validation fails an array of validation errors even if constraints is empty', async () => {
    const error = new ValidationError()
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mock = jest.spyOn(require('class-validator'), 'validateOrReject')
    mock.mockRejectedValueOnce([error])
    const expected = new HttpException({ errors: [] }, HttpStatus.BAD_REQUEST, {
      cause: [error]
    })
    await expect(taskUpdateAction.handle(input, id)).rejects.toEqual(expected)
    mock.mockRestore()
  })
})
