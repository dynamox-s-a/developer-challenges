import React, { useState } from "react";
import meuVideo from "../assets/meu-video.mp4";
import { Link } from "react-router-dom";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, senha);
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-box">
          <h3>Bem-vindo!</h3>
          <h2>Acesso à Conta</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
              />
            </label>
            <label>
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="login-input"
              />
            </label>
            <button type="submit" className="login-button">
              Entrar
            </button>
            <p style={{ marginTop: 20 }}>
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
          </form>
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
}
