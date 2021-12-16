import { IErrorLog } from './error.interface'

export class CreateLogDto {
  method: string

  url: string

  body: JSON

  error: IErrorLog

  statusCode: number
}
