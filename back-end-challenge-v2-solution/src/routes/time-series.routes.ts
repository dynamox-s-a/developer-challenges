import { Router } from "express";
import * as controller from "../controllers/time-series.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { createTimeSeriesSchema } from "../dto/time-series.dto.js";

const router = Router();

router.post("/series", validateBody(createTimeSeriesSchema), controller.create);
router.get("/series/count", controller.count);

export default router;
