import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { integrationOrms } from '../config/consts';
import { CreateLogDto } from '../interfaces/log.interface';
import { Orm, OrmHandler } from '../interfaces/orm.interface';

interface ConfigLogException {
  enabledConsoleLog: boolean;
}

@Catch(Error)
export class LogExceptionFilter implements ExceptionFilter {
  orm: Orm;
  private config: ConfigLogException;

  constructor(
    orm: OrmHandler,
    connectionName: string,
    tableName: string,
    config?: ConfigLogException,
  ) {
    this.orm = new integrationOrms[orm](connectionName, tableName);
    this.config.enabledConsoleLog = config?.enabledConsoleLog || true;
  }

  async catch(exception: Error, host: ArgumentsHost) {
    let statusCode = 500;
    let response = {};

    if (this.config.enabledConsoleLog)
      Logger.log(exception, LogExceptionFilter.name);

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      response = <Record<string, any>>(
        (typeof exception.getResponse() === 'string'
          ? { message: exception.getResponse() }
          : exception.getResponse())
      );
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response = {
        message: 'Erro interno do servidor',
        reason: exception.message,
      };
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const data: CreateLogDto = {
      method: req?.method || 'UNDEF',
      url: req?.originalUrl || 'undefined',
      body: req?.body || {},
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
