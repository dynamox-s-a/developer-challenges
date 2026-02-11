import type { ISensor } from '@/lib/database/sensor/schema'
import type { SensorPresenter } from '../sensor'

export const toSensorPresenter = (sensor: ISensor): SensorPresenter => ({
  _id: sensor._id.toString(),
  Machine: sensor.Machine.toString(),
  Model: sensor.Model,
  createdAt: sensor.createdAt,
  updatedAt: sensor.updatedAt,
})

export const toSensorPresenters = (machines: ISensor[]): SensorPresenter[] =>
  machines.map(toSensorPresenter)
