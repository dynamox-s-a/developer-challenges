import React, { useEffect, useState } from "react";
import axios from "axios";

function corTemperatura(temp) {
  if (temp <= 40) return "green";
  if (temp <= 60) return "yellow";
  return "red";
}

export default function TabelaTemperatura() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/pontos-monitoramento/tcas")
      .then((res) => setDados(res.data))
      .catch((err) => {
        console.error("Erro ao buscar dados TcAs:", err);
      });
  }, []);

  const atualizarTemperatura = (id, novaTemp) => {
    setDados((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, temperatura: novaTemp } : item
      )
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sensores TcAs - Monitoramento de Temperatura</h2>
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ borderCollapse: "collapse", width: "100%", maxWidth: 800 }}
      >
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo Máquina</th>
            <th>Sensor</th>
            <th>Descrição</th>
            <th>Temperatura (°C)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dados.map(
            ({
              id,
              data,
              tipoMaquina,
              sensorModelo,
              descricao,
              temperatura,
            }) => (
              <tr key={id}>
                <td>{data}</td>
                <td>{tipoMaquina}</td>
                <td>{sensorModelo}</td>
                <td>{descricao}</td>
                <td>
                  <input
                    type="number"
                    value={temperatura}
                    onChange={(e) =>
                      atualizarTemperatura(id, Number(e.target.value))
                    }
                    style={{ width: 60 }}
                    min="0"
                    max="100"
                  />
                </td>
                <td>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: corTemperatura(temperatura),
                      border: "1px solid #000",
                      margin: "0 auto",
                    }}
                    title={`Temperatura: ${temperatura} °C`}
                  />
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
