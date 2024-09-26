import { Request, Response } from "express";
import SensorService from "./sensorService";

class SensorController {
  createSensor = async (req: Request, res: Response): Promise<any> => {
    const sensorInfo = req.body;
    const newSensor = await SensorService.createNewSensor(sensorInfo);

    return res.status(200).json(newSensor);
  };

  getAllSensor = async (req: Request, res: Response): Promise<any> => {
    const getInfo = req.query;
    const allSensors = await SensorService.getAllSensor(getInfo);

    return res.status(200).json(allSensors);
  };

  editSensor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const sensorInfo = req.body;
    const updatedSensor = await SensorService.editSensor(id, sensorInfo);

    return res.status(200).json({
      status: "success",
      data: updatedSensor,
    });
  };

  getSensor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const Sensor = await SensorService.getSensor(id);

    return res.status(200).json({
      status: "sucess",
      data: Sensor,
    });
  };

  deleteSensor = async (req: Request, res: Response) => {
    const { id } = req.params;
    await SensorService.deleteSensor(id);

    return res.status(200).json({
      status: "Deleted",
    });
  };
}

export default new SensorController();
