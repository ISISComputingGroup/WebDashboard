import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose'],
  });
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
