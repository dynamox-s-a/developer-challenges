// routes/maquinasRoutes.js
import express from "express";
import {
  listarMaquinas,
  criarMaquina,
  atualizarMaquina,
  deletarMaquina,
} from "../controllers/maquinaController.js";
import { autenticar } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(autenticar); // todas as rotas abaixo exigem login

router.get("/", listarMaquinas);
router.post("/", criarMaquina);
router.put("/:id", atualizarMaquina);
router.delete("/:id", deletarMaquina);

export default router;
