import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { validate } from '@app/shared/environment-variables/environment-variables.helper'
import { AppModule } from '@app/modules/app/app.module'
import { TaskModule } from '@app/modules/task/task.module'

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost/challenge'),
    AppModule,
    TaskModule
  ],
  controllers: [],
  providers: []
})
export class MainModule {}
