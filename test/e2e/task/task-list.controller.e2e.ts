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

describe('TaskCreateController (e2e)', () => {
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

  it('/task (GET 200) should list tasks successfully', async () => {
    const response = await request(app.getHttpServer() as App).get('/task')
    expect(response.status).toEqual(200)
    expect(response.body).toEqual([
      {
        createdAt: expect.any(String),
        description: 'test',
        id: expect.any(String),
        priority: 10,
        status: 'in_progress',
        title: 'test',
        updatedAt: expect.any(String)
      }
    ])
  })

  it('/task (GET 200) should list tasks successfully with correct filter by status', async () => {
    const response = await request(app.getHttpServer() as App)
      .get('/task')
      .query({ status: TASK_STATUS.IN_PROGRESS })
    expect(response.status).toEqual(200)
    expect(response.body).toEqual([
      {
        createdAt: expect.any(String),
        description: 'test',
        id: expect.any(String),
        priority: 10,
        status: 'in_progress',
        title: 'test',
        updatedAt: expect.any(String)
      }
    ])
  })

  it('/task (GET 200) should return empty list when no task is found with the status filter', async () => {
    const response = await request(app.getHttpServer() as App)
      .get('/task')
      .query({ status: TASK_STATUS.COMPLETED })
    expect(response.status).toEqual(200)
    expect(response.body).toEqual([])
  })

  it('/task (GET 200) should list tasks successfully with correct filter by priority', async () => {
    const response = await request(app.getHttpServer() as App)
      .get('/task')
      .query({ priority: 10 })
    expect(response.status).toEqual(200)
    expect(response.body).toEqual([
      {
        createdAt: expect.any(String),
        description: 'test',
        id: expect.any(String),
        priority: 10,
        status: 'in_progress',
        title: 'test',
        updatedAt: expect.any(String)
      }
    ])
  })

  it('/task (GET 200) should return empty list when no task is found with the priority filter', async () => {
    const response = await request(app.getHttpServer() as App)
      .get('/task')
      .query({ priority: 9 })
    expect(response.status).toEqual(200)
    expect(response.body).toEqual([])
  })

  it('/task (GET 400) should throw an error with invalid input data', async () => {
    const response = await request(app.getHttpServer() as App)
      .get('/task')
      .query({ priority: 'test' })
    expect(response.status).toEqual(400)
    expect(response.body).toEqual({
      errors: ['priority must be a number conforming to the specified constraints']
    })
  })

  it('/task (GET 500) should throw an error with internal server error', async () => {
    jest.spyOn(MongooseRepositoryAbstract.prototype, 'findByQuery').mockRejectedValueOnce(new Error('test'))
    const response = await request(app.getHttpServer() as App)
      .get('/task')
      .query({ priority: 10 })
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
