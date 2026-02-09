export interface TaskProps {
  id: string | number;
  task: string;
  checked: boolean;
}

export const tasksData: TaskProps[] = [
  {
    id: 1,
    task: 'Calibrate Sensor TcAg-01',
    checked: false,
  },
  {
    id: 2,
    task: 'Replace Pump A1 Filter',
    checked: true,
  },
  {
    id: 3,
    task: 'Inspect Fan B2 Vibration',
    checked: true,
  },
  {
    id: 4,
    task: 'Update Firmware Gateway',
    checked: false,
  },
  {
    id: 5,
    task: 'Check Redis Persistence',
    checked: true,
  },
];
