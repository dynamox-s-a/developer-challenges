import { Router } from "express";
import { catchAsync } from "../../shared/errorHandling/catchAsync";
import sensorController from "./sensorController";

const router = Router();

router
  .route("/")
  .post(catchAsync(sensorController.createSensor))
  .get(catchAsync(sensorController.getAllSensor));

router
  .route("/:id")
  .patch(catchAsync(sensorController.editSensor))
  .delete(catchAsync(sensorController.deleteSensor))
  .get(catchAsync(sensorController.getSensor));

export default router;
