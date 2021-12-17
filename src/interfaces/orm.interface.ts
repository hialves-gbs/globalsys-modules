import { Response } from 'express';
import { CreateLogDto } from './log.interface';

export type OrmHandler = 'typeorm' | 'prisma';
export interface Orm {
  logExceptionHandler(data: CreateLogDto): Promise<void>;
}
