import { Router } from "express";
import * as controller from "../controllers/time-series.controller.js";
import { validate } from "../middlewares/validate.js";
import { createTimeSeriesSchema } from "../dto/time-series.dto.js";

const router = Router();

router.post("/series", validate(createTimeSeriesSchema), controller.create);
router.get("/series/count", controller.count);

export default router;
