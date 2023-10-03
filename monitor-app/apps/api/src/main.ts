/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
      // disableErrorMessages: true
    })
  )
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  app.enableCors()
  const port = process.env.PORT || 3000
  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
