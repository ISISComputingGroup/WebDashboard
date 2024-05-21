import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { PvsService } from './pvs.service';
import { Response } from 'express';

@Controller('pvs')
export class PvsController {
  constructor(private readonly pvsService: PvsService) {}

  @Post('dehex')
  async dehexPv(@Body() body: any, @Res() res: Response): Promise<void> {
    try {
      // const reqBuffer = Buffer.alloc(body);

      // console.log('Body hello:', body.data);

      if (!body.data.length) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Error: empty argument list' });
        return;
      }

      const result = await this.pvsService.dehexAndUnzip(body.data);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error('Error:', error.message);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
