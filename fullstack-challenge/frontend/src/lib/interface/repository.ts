export default interface RepositoryInterface<T> {
  list(): Promise<T[]>
  create(params: T): Promise<void>
  update(params: T): Promise<void>
  delete(params: T): Promise<void>
}