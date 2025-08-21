import React, { useEffect, useState } from "react";
import api from "../services/api";

const sensoresPermitidos = [
  { label: "TcAg", value: "TcAg" },
  { label: "TcAs", value: "TcAs" },
  { label: "HF+", value: "HF+" },
  { label: "Vibração", value: "VIB" },
];

export default function PontoMonitoramentoForm({ onClose, onSaved }) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [sensorModelo, setSensorModelo] = useState("");
  const [maquinaId, setMaquinaId] = useState("");
  const [maquinas, setMaquinas] = useState([]);
  const [erro, setErro] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [vibracao, setVibracao] = useState("");

  const maquinaSelecionada = maquinas.find((m) => m._id === maquinaId);

  useEffect(() => {
    async function buscarMaquinas() {
      try {
        const res = await api.get("/maquinas");
        setMaquinas(res.data);
      } catch (error) {
        console.error("Erro ao buscar máquinas:", error);
      }
    }
    buscarMaquinas();
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setErro("");

    if (!maquinaId || !tipo) {
      setErro("Máquina ou tipo inválido.");
      return;
    }

    if (
      tipo === "Temperatura" &&
      maquinaSelecionada?.tipo === "Bomba" &&
      ["TcAg", "TcAs"].includes(sensorModelo)
    ) {
      setErro(
        "Sensores TcAg e TcAs não são permitidos para máquina do tipo Bomba."
      );
      return;
    }

    // Validação específica para temperatura e vibração
    if (tipo === "Temperatura" && (temperatura === "" || isNaN(temperatura))) {
      setErro("Informe uma temperatura válida.");
      return;
    }
    if (tipo === "Vibracao" && (vibracao === "" || isNaN(vibracao))) {
      setErro("Informe uma vibração válida.");
      return;
    }

    try {
      await api.post("/pontos-monitoramento", {
        nome,
        tipo,
        sensor: { modelo: sensorModelo },
        maquinaId,
        temperatura: tipo === "Temperatura" ? Number(temperatura) : undefined,
        vibracao: tipo === "Vibracao" ? Number(vibracao) : undefined,
      });
      onSaved();
    } catch (err) {
      setErro("Erro ao salvar ponto de monitoramento.");
      console.error(err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Novo Ponto de Monitoramento</h3>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <form onSubmit={handleSalvar}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nome do Ponto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo de Ponto:</label>
            <select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value);
                // Resetar valores ao trocar tipo
                setTemperatura("");
                setVibracao("");
              }}
              required
            >
              <option value="">Selecionar Tipo</option>
              <option value="Temperatura">Temperatura</option>
              <option value="Vibracao">Vibração</option>
            </select>
          </div>

          <div className="form-group">
            <label>Modelo do Sensor:</label>
            <select
              value={sensorModelo}
              onChange={(e) => setSensorModelo(e.target.value)}
              required
            >
              <option value="">Selecionar Sensor</option>
              {sensoresPermitidos.map((sensor) => (
                <option key={sensor.value} value={sensor.value}>
                  {sensor.label}
                </option>
              ))}
            </select>
          </div>

          {tipo === "Temperatura" && (
            <div className="form-group">
              <label>Temperatura (°C):</label>
              <input
                type="number"
                value={temperatura}
                onChange={(e) => setTemperatura(e.target.value)}
                min="0"
                max="150"
                step="0.1"
                required
              />
            </div>
          )}

          {tipo === "Vibracao" && (
            <div className="form-group">
              <label>Vibração (mm/s):</label>
              <input
                type="number"
                value={vibracao}
                onChange={(e) => setVibracao(e.target.value)}
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Máquina:</label>
            <select
              value={maquinaId}
              onChange={(e) => setMaquinaId(e.target.value)}
              required
            >
              <option value="">Selecionar Máquina</option>
              {maquinas.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>

          {maquinaSelecionada && (
            <div className="form-group">
              <label>Tipo da Máquina:</label>
              <input type="text" value={maquinaSelecionada.tipo} readOnly />
            </div>
          )}

          <div className="form-actions" style={{ marginTop: "20px" }}>
            <button type="submit">Salvar</button>
            <button
              type="button"
              onClick={onClose}
              style={{ marginLeft: "10px" }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
