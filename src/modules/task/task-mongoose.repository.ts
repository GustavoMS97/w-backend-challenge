import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Task, TaskDocument } from '@app/modules/task/task.entity'
import { MongooseRepositoryAbstract } from '@app/shared/generic/mongoose-repository.abstract'
import TaskRepositoryInterface from '@app/modules/task/task-repository.interface'

@Injectable()
export default class TaskMongooseRepository extends MongooseRepositoryAbstract<Task, TaskDocument> implements TaskRepositoryInterface {
  constructor(@InjectModel(Task.name) taskModel: Model<TaskDocument>) {
    super(taskModel)
  }
}
