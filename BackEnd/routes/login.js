// routes/login.js
import express from "express";
import {
  registrarUsuario,
  loginUsuario,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/registro", registrarUsuario);
router.post("/", loginUsuario);

export default router;
