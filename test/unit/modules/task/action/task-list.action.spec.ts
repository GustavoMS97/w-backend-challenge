import { Test, TestingModule } from '@nestjs/testing'

import { TaskListAction } from '@app/modules/task/action/task-list.action'
import { TaskListInput, TaskListOutput } from '@app/modules/task/contract/task-list.contract'
import { TASK_STATUS } from '@app/modules/task/enum/task-status.enum'
import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { Task } from '@app/modules/task/task.entity'
import { ValidationError } from 'class-validator'
import { HttpException, HttpStatus } from '@nestjs/common'

describe('TaskListAction', () => {
  let taskListAction: TaskListAction
  let taskMongooseRepositoryMock: jest.Mocked<TaskMongooseRepository>

  const input = Object.assign(new TaskListInput(), { status: TASK_STATUS.IN_PROGRESS, priority: 2 })

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [TaskListAction, { provide: TaskMongooseRepository, useValue: { findByQuery: jest.fn().mockResolvedValue([new Task()]) } }]
    }).compile()

    taskListAction = app.get(TaskListAction)
    taskMongooseRepositoryMock = app.get(TaskMongooseRepository)
  })

  it('should handle task list with success', async () => {
    const output = [new TaskListOutput()]
    await expect(taskListAction.handle(input)).resolves.toEqual(output)
  })

  it('should throw an error when the repository fails to list tasks', async () => {
    const error = new Error('test')
    taskMongooseRepositoryMock.findByQuery.mockRejectedValueOnce(error)
    await expect(taskListAction.handle(input)).rejects.toEqual(
      new Error(`Unknown error during task query: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
    )
  })

  it('should throw an error when the validation fails with generic error', async () => {
    const error = new Error('test')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mock = jest.spyOn(require('class-validator'), 'validateOrReject')
    mock.mockRejectedValueOnce(error)
    await expect(taskListAction.handle(input)).rejects.toEqual(
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
    await expect(taskListAction.handle(input)).rejects.toEqual(expected)
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
    await expect(taskListAction.handle(input)).rejects.toEqual(expected)
    mock.mockRestore()
  })
})
