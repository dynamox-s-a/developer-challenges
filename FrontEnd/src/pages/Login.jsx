import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import meuVideo from "../assets/meu-video.mp4"; // importe o vídeo
import "../styles/login.css"; // seu CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", { email, senha });

      localStorage.setItem("token", response.data.token);
      navigate("/gerenciamento");
    } catch (err) {
      alert("E-mail ou senha inválidos");
    }
  };

  return (
    <div className="login-container">
      {/* Formulário */}
      <div className="login-form-section">
        <div className="login-box">
          <h3>Bem-vindo</h3>
          <h2>Acesso a Conta</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="E-mail"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="login-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>
          <p style={{ marginTop: 20, color: "#fff" }}>
            Não tem conta?{" "}
            <span
              style={{
                color: "#0073e6",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/cadastro")}
            >
              Cadastre-se
            </span>
          </p>
        </div>
      </div>
      <div className="login-video-section">
        <video
          src={meuVideo}
          autoPlay
          muted
          loop
          playsInline
          className="login-video"
        />
      </div>
    </div>
  );
};

export default Login;
