import { PrismaClient } from '@prisma/client';
import { CreateLogDto } from 'src/interfaces/log.interface';
import { Orm } from 'src/interfaces/orm.interface';

export class PrismaHandler implements Orm {
  connectionName: string;
  tableName: string;

  constructor(connectionName: string, tableName: string) {
    this.connectionName = connectionName;
    this.tableName = tableName;
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
