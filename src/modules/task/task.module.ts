import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Task, TaskSchema } from '@app/modules/task/task.entity'
import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { TaskCreateController } from '@app/modules/task/controller/task-create.controller'
import { TaskCreateAction } from '@app/modules/task/action/task-create.action'

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
  providers: [TaskMongooseRepository, TaskCreateAction],
  exports: [TaskCreateAction],
  controllers: [TaskCreateController]
})
export class TaskModule {}
