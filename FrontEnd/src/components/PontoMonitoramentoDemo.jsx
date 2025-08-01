import React, { useState } from "react";

export default function PontosMonitoramento() {
  // Estados para TcAs (temperatura)
  const [novoNomeTcAs, setNovoNomeTcAs] = useState("");
  const [novaTemperatura, setNovaTemperatura] = useState("");
  const [pontosTcAs, setPontosTcAs] = useState([]);

  // Estados para TcAg (vibração com decimais)
  const [novoNomeTcAg, setNovoNomeTcAg] = useState("");
  const [novaVibracao, setNovaVibracao] = useState("");
  const [pontosTcAg, setPontosTcAg] = useState([]);

  // Funções para cor (exemplo simples)
  const corTemperatura = (temp) => {
    if (temp < 20) return "blue";
    if (temp < 40) return "orange";
    return "red";
  };

  const corVibracao = (vib) => {
    if (vib < 10) return "green";
    if (vib < 20) return "orange";
    return "red";
  };

  const adicionarPontoTcAs = () => {
    if (!novoNomeTcAs || novaTemperatura === "") {
      alert("Preencha todos os campos TcAs");
      return;
    }

    setPontosTcAs([
      ...pontosTcAs,
      { nome: novoNomeTcAs, temperatura: Number(novaTemperatura) },
    ]);

    setNovoNomeTcAs("");
    setNovaTemperatura("");
  };

  const adicionarPontoTcAg = () => {
    if (!novoNomeTcAg || novaVibracao === "") {
      alert("Preencha todos os campos TcAg");
      return;
    }

    setPontosTcAg([
      ...pontosTcAg,
      { nome: novoNomeTcAg, vibracao: parseFloat(novaVibracao) },
    ]);

    setNovoNomeTcAg("");
    setNovaVibracao("");
  };

  return (
    <>
      <div style={{ padding: 20 }}>
        <h2>Pontos de Monitoramento (Sensor TcAs)</h2>

        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Nome do ponto"
            value={novoNomeTcAs}
            onChange={(e) => setNovoNomeTcAs(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            type="number"
            placeholder="Temperatura (°C)"
            value={novaTemperatura}
            onChange={(e) => setNovaTemperatura(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <button onClick={adicionarPontoTcAs}>Adicionar Ponto</button>
        </div>

        {pontosTcAs.length === 0 ? (
          <p>Nenhum ponto adicionado.</p>
        ) : (
          pontosTcAs.map((p, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <span>{p.nome}</span>
              <span
                title={`Temperatura: ${p.temperatura} °C`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: corTemperatura(p.temperatura),
                  marginLeft: 8,
                  border: "1px solid #000",
                }}
              ></span>
              <span style={{ marginLeft: 8 }}>{p.temperatura}°C</span>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: 20 }}>
        <h2>Pontos de Monitoramento (Sensor TcAg)</h2>

        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Nome do ponto"
            value={novoNomeTcAg}
            onChange={(e) => setNovoNomeTcAg(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Vibração"
            value={novaVibracao}
            onChange={(e) => setNovaVibracao(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <button onClick={adicionarPontoTcAg}>Adicionar Ponto</button>
        </div>

        {pontosTcAg.length === 0 ? (
          <p>Nenhum ponto adicionado.</p>
        ) : (
          pontosTcAg.map((p, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <span>{p.nome}</span>
              <span
                title={`Vibração: ${p.vibracao}`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: corVibracao(p.vibracao),
                  marginLeft: 8,
                  border: "1px solid #000",
                }}
              ></span>
              <span style={{ marginLeft: 8 }}>
                {p.vibracao.toFixed(2)} Vibração
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}
