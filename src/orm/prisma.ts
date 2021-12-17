import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateLogDto } from '../interfaces/log.interface';
import { Orm } from '../interfaces/orm.interface';

export class PrismaHandler extends PrismaClient implements Orm, OnModuleInit {
  connectionName: string;
  tableName: string;

  constructor(connectionName: string, tableName: string) {
    super();
    this.connectionName = connectionName;
    this.tableName = tableName;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async logExceptionHandler(data: CreateLogDto): Promise<void> {
    const prisma = new PrismaClient();
    try {
      await prisma[this.tableName].create({ data });
    } catch (e) {
      console.log(e);
    }
  }
}
