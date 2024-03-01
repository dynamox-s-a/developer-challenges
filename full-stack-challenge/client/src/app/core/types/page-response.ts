export type PageResponse<T extends object> = {
  page: number
  size: number
  totalPages: number
  total: number
  data: T[]
}
