export type OrderDirection = 'asc' | 'desc'

export interface PageRequest {
  page: number
  size?: number
  orderBy?: string
  orderDirection?: OrderDirection
  criteria?: string
  withDeleted?: string
}
