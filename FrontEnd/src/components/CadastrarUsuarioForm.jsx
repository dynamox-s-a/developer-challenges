// components/CadastrarUsuarioForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/cadastro.css";

export default function CadastrarUsuarioForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmaSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    try {
      const res = await api.post("/auth/register", { email, senha });
      setMensagem("Usuário cadastrado com sucesso!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMensagem(error.response?.data?.message || "Erro no cadastro.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirmar senha"
        value={confirmaSenha}
        onChange={(e) => setConfirmaSenha(e.target.value)}
        required
      />
      <button type="submit">Cadastrar</button>
      {mensagem && <p>{mensagem}</p>}
    </form>
  );
}
