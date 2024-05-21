import { Module } from '@nestjs/common';
import { PvsController } from './pvs.controller';
import { PvsService } from './pvs.service';

@Module({
  controllers: [PvsController],
  providers: [PvsService],
})
export class PvsModule {}
