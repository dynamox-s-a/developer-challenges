import ISensor from '../Interfaces/ISensor';
import MachineODM from '../Models/MachineODM';
import SensorODM from '../Models/SensorODM';

export default class MonitorService {
  public async listAll(userId: string) {
    const sensorODM = new SensorODM();
    const machineODM = new MachineODM();
    const machines = await machineODM.listAll(userId);

    let mPoints: ISensor[] = [];

    await Promise.all(
      machines!.map(async (machine) => {
        const sensors = await sensorODM.listAll(machine.id);
        mPoints = [...mPoints, ...sensors!];
      })
    );

    return mPoints;
  }
}
