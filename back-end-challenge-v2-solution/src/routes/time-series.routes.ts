import { Router } from "express";
import * as controller from "../controllers/time-series.controller.js";
import { validateBody, validateParams } from "../middlewares/validate.js";
import {
  createTimeSeriesSchema,
  getBySeriesIdSchema,
} from "../dto/time-series.dto.js";

const router = Router();

router.post("/series", validateBody(createTimeSeriesSchema), controller.create);
router.get("/series/count", controller.count);
router.get(
  "/series/:seriesId",
  validateParams(getBySeriesIdSchema),
  controller.getById,
);

export default router;
