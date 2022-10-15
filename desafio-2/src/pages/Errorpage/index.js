import React from "react";
import { Errorpg, MsgContainer, Msg, BtnContanier } from "./styles";
import { Linkbtn } from "../../components/Link";
export const ErrorPage = () => {
  return (
    <Errorpg>
      <MsgContainer>
        <Msg>Pagina não encontrada!</Msg>
        <BtnContanier>
          <Linkbtn href="/landing" title="login page" />
        </BtnContanier>
      </MsgContainer>
    </Errorpg>
  );
};
