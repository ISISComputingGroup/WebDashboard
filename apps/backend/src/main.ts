import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const logStream = fs.createWriteStream('file.log', { flags: 'a' });
  // // setup the logger
  // app.use(morgan('dev', { stream: logStream }));
  app.use(morgan('dev'));
  app.enableCors();

  await app.listen(3001, () => {
    console.log('Backend is running on: http://localhost:3001');
  });
}
bootstrap();
