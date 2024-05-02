import * as request from 'supertest'
import { INestApplication, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import mongoose from 'mongoose'
import { App } from 'supertest/types'

import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { MainModule } from '@app/main.module'
import { Task } from '@app/modules/task/task.entity'
import { TASK_STATUS } from '@app/modules/task/enum/task-status.enum'
import { MongooseRepositoryAbstract } from '@app/shared/generic/mongoose-repository.abstract'

describe('TaskUpdateController (e2e)', () => {
  let app: INestApplication
  let taskMongooseRepository: TaskMongooseRepository

  const task = Object.assign(new Task(), {
    _id: new mongoose.Types.ObjectId(),
    title: 'test',
    description: 'test',
    priority: 10,
    status: TASK_STATUS.IN_PROGRESS,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule]
    }).compile()

    taskMongooseRepository = moduleFixture.get(TaskMongooseRepository)
    app = moduleFixture.createNestApplication()
    Logger.overrideLogger([])

    await taskMongooseRepository.create(task)
    await app.init()
  })

  it('/task/:id (PUT 200) should update task successfully', async () => {
    const response = await request(app.getHttpServer() as App)
      .put(`/task/${task._id.toString()}`)
      .send({ title: 'updated title' })
    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      ...task,
      title: 'updated title',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      _id: undefined,
      id: task._id.toString()
    })
  })

  it('/task/:id (PUT 400) should throw an error with invalid input data', async () => {
    const response = await request(app.getHttpServer() as App)
      .put(`/task/${task._id.toString()}`)
      .send({ priority: 'a1' })
    expect(response.status).toEqual(400)
    expect(response.body).toEqual({
      errors: ['priority must be a number conforming to the specified constraints']
    })
  })

  it('/task/:id (PUT 500) should throw an error with internal server error', async () => {
    jest.spyOn(MongooseRepositoryAbstract.prototype, 'update').mockRejectedValueOnce(new Error('test'))
    const response = await request(app.getHttpServer() as App)
      .put(`/task/${task._id.toString()}`)
      .send({ priority: 1 })
    expect(response.status).toEqual(500)
    expect(response.body).toEqual({
      message: 'Internal server error',
      statusCode: 500
    })
  })

  afterAll(async () => {
    await taskMongooseRepository.remove({ _id: task._id })
    await app.close()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
