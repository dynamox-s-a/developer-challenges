import React, { useEffect, useState } from "react";
import axios from "axios";

const corTemperatura = (temp) => {
  if (temp >= 80) return "#f00"; // Vermelho
  if (temp >= 60) return "#ffa500"; // Laranja
  if (temp >= 40) return "#ff0"; // Amarelo
  return "#0f0"; // Verde
};

export default function TemperaturaPorMaquina() {
  const [dados, setDados] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/pontos-monitoramento")
      .then((res) => {
        const agrupado = {};
        res.data.forEach((p) => {
          if (!agrupado[p.maquinaId]) {
            agrupado[p.maquinaId] = {
              maquinaNome: p.maquinaNome,
              tipo: p.tipoMaquina,
              pontos: [],
            };
          }
          agrupado[p.maquinaId].pontos.push(p);
        });
        setDados(agrupado);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Pontos com Sensor TcAs por Máquina</h2>

      {/* 🔷 LEGENDA DE CORES */}
      <div style={{ marginBottom: 20, display: "flex", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#0f0",
              borderRadius: "50%",
              border: "1px solid #000",
            }}
          ></span>
          <span>{"< 40°C"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#ff0",
              borderRadius: "50%",
              border: "1px solid #000",
            }}
          ></span>
          <span>40–59°C</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#ffa500",
              borderRadius: "50%",
              border: "1px solid #000",
            }}
          ></span>
          <span>60–79°C</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#f00",
              borderRadius: "50%",
              border: "1px solid #000",
            }}
          ></span>
          <span>{">= 80°C"}</span>
        </div>
      </div>
      {Object.entries(dados)
        .filter(([_, m]) => m.maquinaNome)
        .map(([maquinaId, m]) => (
          <div key={maquinaId}>...</div>
        ))}
    </div>
  );
}
