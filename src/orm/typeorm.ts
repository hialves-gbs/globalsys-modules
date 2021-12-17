import { CreateLogDto } from 'src/interfaces/log.interface';
import { Orm } from 'src/interfaces/orm.interface';
import { getConnectionManager } from 'typeorm';

export class TypeormHandler implements Orm {
  connectionName: string;
  tableName: string;

  constructor(connectionName: string, tableName: string) {
    this.connectionName = connectionName;
    this.tableName = tableName;
  }

  async logExceptionHandler(data: CreateLogDto): Promise<void> {
    const manager = getConnectionManager();
    const connection = manager.get(this.connectionName);
    !connection.isConnected && connection.connect();

    try {
      await connection
        .createQueryBuilder()
        .insert()
        .into(this.tableName)
        .values(data)
        .execute();
    } catch (e) {
      console.log(e);
    }
  }
}
