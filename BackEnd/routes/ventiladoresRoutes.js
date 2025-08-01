import express from "express";

const router = express.Router();

const ventiladores = [
  {
    id: 1,
    data: "29/07/2025",
    tipoMaquina: "Ventilador",
    sensorModelo: "TcAs",
    descricao: "Temperatura",
    temperatura: 25,
  },
  {
    id: 2,
    data: "29/07/2025",
    tipoMaquina: "Ventilador",
    sensorModelo: "TcAs",
    descricao: "Temperatura",
    temperatura: 45,
  },
  {
    id: 3,
    data: "29/07/2025",
    tipoMaquina: "Ventilador",
    sensorModelo: "TcAs",
    descricao: "Temperatura",
    temperatura: 70,
  },
];

// GET /api/ventiladores
router.get("/", (req, res) => {
  res.json(ventiladores);
});

export default router;
