import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as pack from '@root/package.json'

import { MainModule } from '@app/main.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(MainModule)

  const config = new DocumentBuilder()
    .setTitle('Code Challenge')
    .setDescription('The code challenge API description')
    .setVersion(pack.version)
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT || 3000)
}
void bootstrap()
