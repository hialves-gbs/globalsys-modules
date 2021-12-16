export interface IConnection {
  host: string
  port: number
  username: string
  password: string
  database: string
}

export interface ILocalConnection extends IConnection {
  dialect: 'string'
}

export interface IAuroraConnection extends IConnection {
  type: 'mysql' | 'mariadb' | 'postgres'
  name?: string
}
