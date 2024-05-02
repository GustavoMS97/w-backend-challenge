import * as request from 'supertest'
import { App } from 'supertest/types'
import { INestApplication, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import mongoose from 'mongoose'

import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { Task } from '@app/modules/task/task.entity'
import { TASK_STATUS } from '@app/modules/task/enum/task-status.enum'
import { MainModule } from '@app/main.module'
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

  it('/task/:id (DELETE 200) should delete task successfully', async () => {
    const response = await request(app.getHttpServer() as App).delete(`/task/${task._id.toString()}`)
    expect(response.status).toEqual(200)
  })

  it('/task:id (DELETE 400) should throw an error with invalid input data', async () => {
    const response = await request(app.getHttpServer() as App).delete(`/task/invalid_id_hehe}`)
    expect(response.status).toEqual(400)
    expect(response.body).toEqual({
      errors: ['Invalid id format']
    })
  })

  it('/task/:id (DELETE 500) should throw an error with internal server error', async () => {
    jest.spyOn(MongooseRepositoryAbstract.prototype, 'remove').mockRejectedValueOnce(new Error('test'))
    const response = await request(app.getHttpServer() as App).delete(`/task/${task._id.toString()}`)
    expect(response.status).toEqual(500)
    expect(response.body).toEqual({
      message: 'Internal server error',
      statusCode: 500
    })
  })

  afterAll(async () => {
    await app.close()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
