import { Controller, Get } from '@nestjs/common'

import { AppService } from '@app/modules/app/app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log(this.appService.getHello())
    return this.appService.getHello()
  }
}
