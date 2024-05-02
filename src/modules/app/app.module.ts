import { Module } from '@nestjs/common'

import { AppController } from '@app/modules/app/app.controller'
import { AppService } from '@app/modules/app/app.service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
