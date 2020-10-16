export interface QueryResult<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  data: T[];
}
