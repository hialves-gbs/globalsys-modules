export interface IProcedureRepository {
  executeProcedure(queryString: string): Promise<Record<string, unknown>>
}

export interface IProcedureController {
  handle(): Promise<Record<string, unknown>>
}
