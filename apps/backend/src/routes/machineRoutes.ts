import express from "express";
import {
  getMachines,
  createMachine,
  getMachineById,
  updateMachine,
  deleteMachine,
} from "../controllers/machineController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").get(protect, getMachines).post(protect, createMachine);
router
  .route("/:id")
  .get(protect, getMachineById)
  .put(protect, updateMachine)
  .delete(protect, deleteMachine);

export default router;
