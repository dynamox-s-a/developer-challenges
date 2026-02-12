import type { IMonitoringPoint } from '@/lib/database/monitoring_point/schema'
import type { MonitoringPointPresenter } from '../monitoring-point'
import type { IMachine } from '@/lib/database/machine/schema'
import type { ISensor } from '@/lib/database/sensor/schema'
import type { MonitoringAnalysisPresenter } from '../monitoring-analysis'

export const toMonitoringPointPresenter = (
  mp: IMonitoringPoint,
): MonitoringPointPresenter => ({
  _id: mp._id.toString(),
  Machine: mp.Machine.toString(),
  Name: mp.Name,
  Sensor: mp.Sensor?.toString(),
  createdAt: mp.createdAt,
  updatedAt: mp.updatedAt,
})

export const toMonitoringPointsPresenters = (
  mps: IMonitoringPoint[],
): MonitoringPointPresenter[] => mps.map(toMonitoringPointPresenter)

export type PopulatedMonitoringPoint = Omit<
  IMonitoringPoint,
  'Machine' | 'Sensor'
> & {
  Machine: IMachine
  Sensor?: ISensor
}

export const toMonitoringAnalysis = (
  mp: PopulatedMonitoringPoint,
): MonitoringAnalysisPresenter => {
  if (!mp.Machine) {
    throw new Error('MonitoringPoint sem Machine associada')
  }

  return {
    _id: mp._id.toString(),
    Name: mp.Name,
    Machine: {
      _id: mp.Machine._id.toString(),
      Name: mp.Machine.Name ?? 'N/A',
      Type: mp.Machine.Type ?? 'Pump',
      createdAt: mp.Machine.createdAt
        ? new Date(mp.Machine.createdAt)
        : new Date(),
      updatedAt: mp.Machine.updatedAt
        ? new Date(mp.Machine.updatedAt)
        : new Date(),
    },
    Sensor: mp.Sensor
      ? {
          _id: mp.Sensor._id.toString(),
          Code: mp.Sensor.Code ?? '',
          Model: mp.Sensor.Model ?? 'HF+',
          Machine: mp.Sensor.Machine?.toString() ?? '',
          createdAt: mp.Sensor.createdAt
            ? new Date(mp.Sensor.createdAt)
            : new Date(),
          updatedAt: mp.Sensor.updatedAt
            ? new Date(mp.Sensor.updatedAt)
            : new Date(),
        }
      : undefined,
    createdAt: mp.createdAt ? new Date(mp.createdAt) : new Date(),
    updatedAt: mp.updatedAt ? new Date(mp.updatedAt) : new Date(),
  }
}

export const toMonitoringAnalysisArray = (
  mps: PopulatedMonitoringPoint[],
): MonitoringAnalysisPresenter[] => mps.map(toMonitoringAnalysis)
