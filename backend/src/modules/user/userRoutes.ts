import { Router } from "express";
import { catchAsync } from "../../shared/errorHandling/catchAsync";
import userController from "./userController";

const router = Router();

router
  .route("/")
  .post(catchAsync(userController.createUser))
  .get(catchAsync(userController.getAllUsers));

router
  .route("/:id")
  .patch(catchAsync(userController.editUser))
  .delete(catchAsync(userController.deleteUser))
  .get(catchAsync(userController.getUser));

export default router;
