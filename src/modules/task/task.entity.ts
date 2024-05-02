import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Type } from 'class-transformer'
import mongoose from 'mongoose'

import { TASK_STATUS } from '@app/modules/task/enum/task-status.enum'

@Schema()
class Task {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  priority: number

  @Prop({ required: true })
  status: TASK_STATUS

  @Type(() => Date)
  @Prop({ required: true, default: Date.now })
  createdAt: Date

  @Type(() => Date)
  @Prop({ required: true, default: Date.now })
  updatedAt: Date
}

type TaskDocument = Task & mongoose.Document

const TaskSchema = SchemaFactory.createForClass(Task)

export { TaskSchema, TaskDocument, Task }
