import { useState } from "react";

import {
  FormularioContanier,
  Title,
  InputContanier,
  Input,
  SubmitButton,
  ButtonName,
} from "./styles";

export function Footer() {
  const [name, setName] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [newContats, setNewContat] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !empresa || !telefone) {
      console.log("Preencha todas as informações");
    }
    const newContat = { name, email, empresa, telefone };
    setNewContat(newContat);
    window.alert(`
    name: ${newContats.name}
    empresa: ${newContats.empresa}
    email: ${newContats.email}
    telefone: ${newContats.telefone}

    `);
  };

  return (
    <FormularioContanier id="Contato">
      <Title>
        Ficou com dúvida? <br /> Nós entramos em contato com você
      </Title>
      <InputContanier>
        <Input
          placeholder="Como gostaria de ser chamado?"
          type="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Em qual empresa voce trabalha?"
          type="empresa"
          name="empresa"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
        />
        <Input
          placeholder="Digite aqui o seu email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Qual o seu telefone?"
          type="telefone"
          name="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <SubmitButton type="submit" onClick={handleSubmit}>
          <ButtonName>enviar</ButtonName>
        </SubmitButton>
      </InputContanier>
    </FormularioContanier>
  );
}
