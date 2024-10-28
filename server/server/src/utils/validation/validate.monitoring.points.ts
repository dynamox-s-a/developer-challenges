import { Machine } from '@prisma/client';
import Sensor from 'src/VOs/sensors.vo';

export default async function isValidMonitoringPoint(
  sensor: Sensor,
  machinePromise: Promise<Machine>,
): Promise<boolean> {
  const machine = await machinePromise;
  if (sensor.modelName == 'TcAg' || sensor.modelName == 'TcAs') {
    if (machine.type == 'PUMP') return false;
    else return true;
  } else {
    return true;
  }
}
