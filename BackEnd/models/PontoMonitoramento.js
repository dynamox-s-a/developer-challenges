import mongoose from "mongoose";

const pontoMonitoramentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: {
    type: String,
    enum: ["Temperatura", "Vibracao"],
    required: true,
  },
  sensor: {
    modelo: { type: String, required: true },
    id: { type: String, required: true },
  },
  maquinaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maquina",
    required: true,
  },
  temperatura: { type: Number, default: 0 },
  vibracao: { type: Number, default: 0 },
});

const PontoMonitoramento = mongoose.model(
  "PontoMonitoramento",
  pontoMonitoramentoSchema
);

export default PontoMonitoramento;
