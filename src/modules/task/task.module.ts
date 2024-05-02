import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Task, TaskSchema } from '@app/modules/task/task.entity'
import TaskMongooseRepository from '@app/modules/task/task-mongoose.repository'
import { TaskCreateController } from '@app/modules/task/controller/task-create.controller'
import { TaskListController } from '@app/modules/task/controller/task-list.controller'
import { TaskCreateAction } from '@app/modules/task/action/task-create.action'
import { TaskListAction } from '@app/modules/task/action/task-list.action'

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
  providers: [TaskMongooseRepository, TaskCreateAction, TaskListAction],
  exports: [TaskCreateAction, TaskListAction],
  controllers: [TaskCreateController, TaskListController]
})
export class TaskModule {}
