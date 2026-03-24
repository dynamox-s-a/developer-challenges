export type MachineType = 'Pump' | 'Fan'

export type Machine = {
  id: string
  name: string
  type: MachineType
}

export type MachinesState = {
  items: Machine[]
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}
