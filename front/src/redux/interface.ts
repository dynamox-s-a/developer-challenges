export interface UserReduxState {
  id?: number
  name?: string
  email?: string
}

export interface MachineReduxState {
  id?: number
  name?: string
  type?: string
}

export interface PointReduxState {
  id?: number
  name?: string
  linkedMachine?: string
}