import * as request from 'supertest'
import { INestApplication, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { App } from 'supertest/types'

import { MainModule } from '@app/main.module'
import { MongooseRepositoryAbstract } from '@app/shared/generic/mongoose-repository.abstract'

describe('TaskCreateController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    Logger.overrideLogger([])
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
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: 'pending',
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

  it('/task (POST 500) should throw an error with internal server error', async () => {
    const input = {
      title: 'Create project board 2',
      description: 'Create the board in trello for the project X',
      priority: 5
    }
    jest.spyOn(MongooseRepositoryAbstract.prototype, 'create').mockRejectedValueOnce(new Error('test'))
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

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
