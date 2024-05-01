import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'

import { AppModule } from '@app/app.module'
import { AppService } from '@app/modules/app/app.service'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(AppService)
      .useValue({ getHello: jest.fn().mockReturnValue('Hello World!') })
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer() as App)
      .get('/')
      .expect(200)
      .expect('Hello World!')
  })

  afterAll(async () => {
    await app.close()
  })
})
