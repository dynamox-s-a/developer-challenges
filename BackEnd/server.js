// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import maquinasRoutes from "./routes/maquinas.js";
import pontoMonitoramentoRoutes from "./routes/pontoMonitoramentoRoutes.js";
import ventiladoresRoutes from "./routes/ventiladoresRoutes.js";
import loginRoutes from "./routes/login.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/login", loginRoutes); // <- corrigido
app.use("/api/maquinas", maquinasRoutes);
app.use("/api/pontos-monitoramento", pontoMonitoramentoRoutes);
app.use("/api/ventiladores", ventiladoresRoutes);

mongoose
  .connect("mongodb://localhost:27017/gerenciamento", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(err));
