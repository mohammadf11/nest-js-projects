import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('Request');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl, body } = req;

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const duration = Date.now() - start;

      this.logger.log(
        `Method: ${method} | URL: ${originalUrl} | Status: ${statusCode} | Duration: ${duration}ms | Request Body: ${JSON.stringify(
          body,
        )}`,
      );
    });

    next();
  }
}
