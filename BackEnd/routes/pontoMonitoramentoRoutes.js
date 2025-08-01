import express from "express";
import {
  criarPonto,
  listarPontos,
  excluirPonto,
  atualizarPonto,
} from "../controllers/pontoMonitoramentoController.js";

const router = express.Router();

router.post("/", criarPonto); // POST /api/pontos-monitoramento
router.get("/", listarPontos); // GET /api/pontos-monitoramento
router.delete("/:id", excluirPonto); // DELETE /api/pontos-monitoramento/:id
router.put("/:id", atualizarPonto); // PUT /api/pontos-monitoramento/:id

export default router;
