import axios from "axios";
import React from "react";
import { Button } from "../Button";

import {
  ItemContanier,
  Header,
  InfoContanier,
  Propriedade,
  Nome,
  ButtonContainer,
} from "./styles";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEditItem } from "../../features/Item/itemSlice";

export const Items = ({
  id,
  produto,
  fabDate,
  perishable,
  validade,
  price,
}) => {
  {
    /* Nao consegui terminar essa parte do projeto a tempo. 
      A ideia seria navegar para a pagina de add-item, que funcionaria como a pagina de edicao dos items.
      com o submit o uma funcao put seria acionada para alterar os valores desejados no servidor.
    */
  }
  const handleDeleteItem = (e) => {
    axios.delete(`http://localhost:3002/Products/${id}`).then((response) => {
      return alert("Item deletado");
    });
  };
  return (
    <ItemContanier key={id}>
      <Header>
        <Nome>{produto}</Nome>
      </Header>
      <ButtonContainer>
        {/* Nao consegui terminar essa parte do projeto a tempo.*/}
        <Button title="Editar"></Button>
        <Button title="Deletar" onClick={handleDeleteItem}></Button>
      </ButtonContainer>

      <InfoContanier>
        <Propriedade>Data de fabricação: {fabDate}</Propriedade>
        <Propriedade>Data de validade:{validade}</Propriedade>
        <Propriedade>Perecivel: {perishable}</Propriedade>
        <Propriedade>Valor: {price}</Propriedade>
      </InfoContanier>
    </ItemContanier>
  );
};
