export class CreateMonitoringPointDto {
  name: string;
  machineId: string;
  sensorModel: 'TcAg' | 'TcAs' | 'HF_Plus';
}
