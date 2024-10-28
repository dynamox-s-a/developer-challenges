export default class Sensor {
  id!: number;
  modelName!: "TcAg" | "TcAs" | "HF+" | "";

  private static readonly sensors: Sensor[] = [
    { id: 1, modelName: "TcAg" },
    { id: 2, modelName: "TcAs" },
    { id: 3, modelName: "HF+" },
  ];

  public static getAllSensors(): Sensor[] {
    return this.sensors;
  }

  public static getSensorById(id: number): Sensor | undefined {
    return this.sensors.find((sensor) => sensor.id === id);
  }

  public static getTcAg(): Sensor {
    return this.sensors[0];
  }

  public static getTcAs(): Sensor {
    return this.sensors[1];
  }

  public static getHFPlus(): Sensor {
    return this.sensors[2];
  }
}
