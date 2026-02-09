export interface Machine {
  id: string;
  name: string;
  monitoringPointsCount: number;
  velocity: number;
  acceleration: number;
  temperature: number;
}

export const machinesRows: Machine[] = [
  {
    id: 'MAC001',
    name: 'Industrial Pump A',
    monitoringPointsCount: 12,
    velocity: 2.5,
    acceleration: 0.8,
    temperature: 45.2,
  },
  {
    id: 'MAC002',
    name: 'Conveyor Belt B1',
    monitoringPointsCount: 8,
    velocity: 1.2,
    acceleration: 0.4,
    temperature: 38.5,
  },
  {
    id: 'MAC003',
    name: 'Air Compressor C',
    monitoringPointsCount: 15,
    velocity: 4.8,
    acceleration: 1.5,
    temperature: 52.1,
  },
  {
    id: 'MAC004',
    name: 'Hydraulic Press D',
    monitoringPointsCount: 20,
    velocity: 0.5,
    acceleration: 0.2,
    temperature: 41.3,
  },
  {
    id: 'MAC005',
    name: 'Cooling Fan E',
    monitoringPointsCount: 6,
    velocity: 3.1,
    acceleration: 0.9,
    temperature: 33.7,
  },
];
