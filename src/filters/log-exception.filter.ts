/* eslint-disable prefer-rest-params */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { CreateLogDto } from 'src/interfaces/log.interface'
import { EntityTarget, getConnectionManager } from 'typeorm'

@Catch()
export class LogExceptionFilter implements ExceptionFilter {
  connectionName: string
  entity: EntityTarget<unknown>

  constructor(connectionName: string, entity: EntityTarget<unknown>) {
    this.connectionName = connectionName
    this.entity = entity
  }

  async catch(exception: Error, host: ArgumentsHost) {
    const manager = getConnectionManager()
    const connection = manager.get(this.connectionName)
    !connection.isConnected && connection.connect()

    let statusCode = 500
    let response = {}

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      response = <Record<string, any>>(
        (typeof exception.getResponse() === 'string'
          ? { message: exception.getResponse() }
          : exception.getResponse())
      )
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR
      response = { message: 'Internal server error' }
    }

    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    const req = ctx.getRequest<Request>()

    const data: CreateLogDto = {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      error: {
        message: exception.message,
        stacktrace: exception?.stack,
      },
      statusCode,
    }

    try {
      await connection
        .createQueryBuilder()
        .insert()
        .into(this.entity)
        .values(data)
        .execute()
    } catch (e) {
      console.log(e)
    }

    res.status(statusCode).json({ statusCode, ...response })
  }
}
