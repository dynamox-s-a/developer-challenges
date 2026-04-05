import { Router } from "express";
import * as controller from "../controllers/time-series.controller.js";
import { validateBody, validateParams } from "../middlewares/validate.js";
import {
  createTimeSeriesSchema,
  deleteTimeSeriesSchema,
  getBySeriesIdSchema,
} from "../dto/time-series.dto.js";

const router = Router();

router.post("/series", validateBody(createTimeSeriesSchema), controller.create);
router.get("/series/count", controller.count);
router.get(
  "/series/:series_id/metrics",
  validateParams(getBySeriesIdSchema),
  controller.getMetrics,
);
router.get(
  "/series/:series_id",
  validateParams(getBySeriesIdSchema),
  controller.getById,
);
router.delete(
  "/series/:series_id",
  validateParams(deleteTimeSeriesSchema),
  controller.remove,
);

export default router;
