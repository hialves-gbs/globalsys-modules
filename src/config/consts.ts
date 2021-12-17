import { PrismaHandler } from '../orm/prisma';
import { TypeormHandler } from '../orm/typeorm';

export const integrationOrms = {
  typeorm: TypeormHandler,
  prisma: PrismaHandler,
};
