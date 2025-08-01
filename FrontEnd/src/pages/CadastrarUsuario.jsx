import React from "react";
import { useNavigate, Link } from "react-router-dom";
import CadastrarUsuarioForm from "../components/CadastrarUsuarioForm";

export default function CadastrarUsuario() {
  const navigate = useNavigate();

  return (
    <div className="cadastro-container">
      <CadastrarUsuarioForm onSuccess={() => navigate("/")} />

      <Link to="/" className="voltar-login">
        Já tenho conta. Fazer login.
      </Link>
    </div>
  );
}
