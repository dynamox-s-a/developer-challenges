import { Router } from "express";
import { catchAsync } from "../../shared/errorHandling/catchAsync";
import machineController from "./machineController";
import AuthMiddleware from "../../middlewares/authMiddleware";

const router = Router();

router
  .route("/")
  .post(catchAsync(machineController.createMachine))
  .get(catchAsync(machineController.getAllMachines));

router
  .route("/:id")
  .put(catchAsync(machineController.editMachine))
  .delete(
    AuthMiddleware.restrictTo("Administrador", "Diretor"),
    catchAsync(machineController.deleteMachine),
  )
  .get(catchAsync(machineController.getMachine));

export default router;
