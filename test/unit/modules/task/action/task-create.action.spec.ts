import { Test, TestingModule } from '@nestjs/testing'
import { ValidationError } from 'class-validator'
import { HttpException, HttpStatus } from '@nestjs/common'

import { TaskCreateAction } from '@app/modules/task/action/task-create.action'
import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { TaskCreateInput, TaskCreateOutput } from '@app/modules/task/contract/task-create.contract'
import { Task } from '@app/modules/task/task.entity'

describe('TaskCreateAction', () => {
  let taskCreateAction: TaskCreateAction
  let taskMongooseRepositoryMock: jest.Mocked<TaskMongooseRepository>

  const input = Object.assign(new TaskCreateInput(), { title: 'new title', description: 'test description', priority: 10 })

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [TaskCreateAction, { provide: TaskMongooseRepository, useValue: { create: jest.fn().mockResolvedValue(new Task()) } }]
    }).compile()

    taskCreateAction = app.get(TaskCreateAction)
    taskMongooseRepositoryMock = app.get(TaskMongooseRepository)
  })

  it('should handle task creation with success', async () => {
    const output = new TaskCreateOutput()
    await expect(taskCreateAction.handle(input)).resolves.toEqual(output)
  })

  it('should throw an error when the repository fails to create a task', async () => {
    const error = new Error('test')
    taskMongooseRepositoryMock.create.mockRejectedValueOnce(error)
    await expect(taskCreateAction.handle(input)).rejects.toEqual(
      new Error(`Unknown error during task creation: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
    )
  })

  it('should throw an error when the validation fails with generic error', async () => {
    const error = new Error('test')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mock = jest.spyOn(require('class-validator'), 'validateOrReject')
    mock.mockRejectedValueOnce(error)
    await expect(taskCreateAction.handle(input)).rejects.toEqual(
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
    await expect(taskCreateAction.handle(input)).rejects.toEqual(expected)
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
    await expect(taskCreateAction.handle(input)).rejects.toEqual(expected)
    mock.mockRestore()
  })
})
