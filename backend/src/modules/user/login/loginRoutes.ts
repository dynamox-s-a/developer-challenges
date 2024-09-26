import { Router } from "express";
import { catchAsync } from "../../../shared/errorHandling/catchAsync";
import loginController from "./loginController";

const router = Router();

router.route("/").post(catchAsync(loginController.login));

export default router;
