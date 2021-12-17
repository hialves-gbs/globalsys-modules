/* eslint-disable prefer-rest-params */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateLogDto } from 'src/interfaces/log.interface';
import { Orm, OrmHandler } from 'src/interfaces/orm.interface';
import { PrismaHandler } from 'src/orm/prisma';
import { TypeormHandler } from 'src/orm/typeorm';
import { getConnectionManager } from 'typeorm';

@Catch()
export class LogExceptionFilter implements ExceptionFilter {
  orm: Orm;

  constructor(orm: OrmHandler, connectionName: string, tableName: string) {
    if (orm === 'typeorm') {
      this.orm = new TypeormHandler(connectionName, tableName);
    } else if (orm === 'prisma') {
      this.orm = new PrismaHandler(connectionName, tableName);
    }
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
