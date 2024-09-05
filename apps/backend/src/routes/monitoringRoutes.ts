import express from "express";
import {
  getMonitoringsForMachine,
  addMonitoring,
  deleteMonitoring,
  updateMonitoring,
  getMonitoringById,
} from "../controllers/monitoringController";
import {
  getSensorsForMonitoring,
  addSensor,
} from "../controllers/sensorController"; // Importe as funções para sensores
import { protect } from "../middleware/authMiddleware";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getMonitoringsForMachine)
  .post(protect, addMonitoring);

router
  .route("/:monitoringId")
  .get(protect, getMonitoringById)
  .put(protect, updateMonitoring)
  .delete(protect, deleteMonitoring);

router
  .route("/:monitoringId/sensors") // Rota para sensores dentro de um monitoramento
  .get(protect, getSensorsForMonitoring)
  .post(protect, addSensor);

export default router;
