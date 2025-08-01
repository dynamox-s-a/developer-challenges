import React from "react";
import CadastroUsuarioForm from "../components/CadastrarUsuarioForm";

export default function ModalCadastro({ aberto, fechar }) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={fechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cadastrar Usuário</h2>
        <CadastroForm fecharModal={fechar} />
        <button onClick={fechar}>Fechar</button>
      </div>
    </div>
  );
}
