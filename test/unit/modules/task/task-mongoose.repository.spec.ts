import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'

import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { Task } from '@app/modules/task/task.entity'

describe('TaskMongooseRepository', () => {
  let taskMongooseRepository: TaskMongooseRepository

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [TaskMongooseRepository, { provide: getModelToken(Task.name), useValue: {} }]
    }).compile()

    taskMongooseRepository = app.get(TaskMongooseRepository)
  })

  it('should create an instance of the repository', () => {
    expect(taskMongooseRepository).toBeDefined()
  })
})
