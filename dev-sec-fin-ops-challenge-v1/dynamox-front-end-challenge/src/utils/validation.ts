import type { MachineType } from '../features/machines/types'
import type { SensorModel } from '../features/monitoring/types'

export function isSensorAllowedForMachine(machineType: MachineType, model: SensorModel): boolean {

  if (machineType === 'Pump' && (model === 'TcAg' || model === 'TcAs')) return false
  return true
}

export function assertSensorAllowed(machineType: MachineType, model: SensorModel) {
  if (!isSensorAllowedForMachine(machineType, model)) {
    throw new Error('Sensores TcAg e TcAs não podem ser associados a máquinas do tipo Pump.')
  }
}
