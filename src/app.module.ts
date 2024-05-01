import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { validate } from '@app/shared/environment-variables/environment-variables.helper'
import { AppController } from '@app/modules/app/app.controller'
import { AppService } from '@app/modules/app/app.service'

@Module({
  imports: [ConfigModule.forRoot({ validate }), MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost/challenge')],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
