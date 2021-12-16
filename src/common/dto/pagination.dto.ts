import { Type } from 'class-transformer'
import { IsPositive, IsOptional } from 'class-validator'

export class PaginationPayloadDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 10

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1
}

export class PaginationResultDto<T> extends PaginationPayloadDto {
  @Type(() => Number)
  total: number

  @Type(() => Number)
  lastPage: number

  data: T[]
}
