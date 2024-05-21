import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // for each part of body log first 10 characters just to get a preview
    const bodyPreview = {};
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        bodyPreview[key] = req.body[key].toString().slice(0, 10);
      }
    }

    const currentDate = new Date();
    const formattedDate =
      currentDate.getDate().toString().padStart(2, '0') +
      '/' +
      (currentDate.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      currentDate.getFullYear();
    const formattedTime =
      currentDate.getHours().toString().padStart(2, '0') +
      ':' +
      currentDate.getMinutes().toString().padStart(2, '0') +
      ':' +
      currentDate.getSeconds().toString().padStart(2, '0');

    console.log(
      ' LoggerMiddleware - ' +
        formattedDate +
        ', ' +
        formattedTime +
        ' ' +
        req.url +
        ' ' +
        req.method +
        ' ' +
        JSON.stringify(bodyPreview),
    );

    next();
  }
}
