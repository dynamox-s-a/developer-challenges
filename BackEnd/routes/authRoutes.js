// routes/authRoutes.js
import express from "express";
import {
  registrarUsuario,
  loginUsuario,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);

export default router;
