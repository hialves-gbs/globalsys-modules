import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { integrationOrms } from 'src/config/consts';
import { CreateLogDto } from '../interfaces/log.interface';
import { Orm, OrmHandler } from '../interfaces/orm.interface';

@Catch()
export class LogExceptionFilter implements ExceptionFilter {
  orm: Orm;

  constructor(orm: OrmHandler, connectionName: string, tableName: string) {
    this.orm = new integrationOrms[orm](connectionName, tableName);
  }

  async catch(exception: Error, host: ArgumentsHost) {
    let statusCode = 500;
    let response = {};

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      response = <Record<string, any>>(
        (typeof exception.getResponse() === 'string'
          ? { message: exception.getResponse() }
          : exception.getResponse())
      );
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response = { message: 'Internal server error' };
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const data: CreateLogDto = {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      error: {
        message: exception.message,
        stacktrace: exception?.stack,
      },
      statusCode,
    };

    await this.orm.logExceptionHandler(data);

    res.status(statusCode).json({ statusCode, ...response });
  }
}
