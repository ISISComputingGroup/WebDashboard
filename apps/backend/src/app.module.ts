import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PvsModule } from './pvs/pvs.module'; // adjust the path as needed
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [PvsModule],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('pvs');
  }
}
