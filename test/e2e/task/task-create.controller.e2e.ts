import * as request from 'supertest'
import mongoose from 'mongoose'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { App } from 'supertest/types'

import { MainModule } from '@app/main.module'
import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { Task } from '@app/modules/task/task.entity'
import { TASK_STATUS } from '@app/modules/task/enum/task-status.enum'

describe('TaskCreateController (e2e)', () => {
  let app: INestApplication
  let taskMongooseRepository: Partial<jest.Mocked<TaskMongooseRepository>>

  const createResultMock = Object.assign(new Task(), {
    _id: new mongoose.Types.ObjectId(),
    title: 'test',
    description: 'test',
    priority: 10,
    status: TASK_STATUS.IN_PROGRESS,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  beforeAll(async () => {
    taskMongooseRepository = {
      create: jest.fn().mockResolvedValue(createResultMock)
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule]
    })
      .overrideProvider(TaskMongooseRepository)
      .useValue(taskMongooseRepository)
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/task (POST 201) should create a task successfully', async () => {
    const input = {
      title: 'Create project board 2',
      description: 'Create the board in trello for the project X',
      priority: 5
    }
    const response = await request(app.getHttpServer() as App)
      .post('/task')
      .send(input)
    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      id: expect.any(String),
      title: 'test',
      description: 'test',
      priority: 10,
      status: 'in_progress',
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  })

  it('/task (POST 400) should throw an error with invalid input data', async () => {
    const input = {
      title: 'Create project board 2',
      description: 'Create the board in trello for the project X'
    }
    const response = await request(app.getHttpServer() as App)
      .post('/task')
      .send(input)
    expect(response.status).toEqual(400)
    expect(response.body).toEqual({
      errors: ['priority must be a number conforming to the specified constraints']
    })
  })

  it('/task (POST 500) should throw an error with internal server errr', async () => {
    const input = {
      title: 'Create project board 2',
      description: 'Create the board in trello for the project X',
      priority: 5
    }
    taskMongooseRepository.create?.mockRejectedValueOnce(new Error('test'))
    const response = await request(app.getHttpServer() as App)
      .post('/task')
      .send(input)
    expect(response.status).toEqual(500)
    expect(response.body).toEqual({
      message: 'Internal server error',
      statusCode: 500
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
