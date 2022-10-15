import styled from "styled-components";

export const FormularioContanier = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 450px;
  background-color: #263252;
`;
export const Title = styled.h1`
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 35px;
  text-align: center;

  color: #ffffff;
`;

export const InputContanier = styled.form`
  justify-content: center;
  text-align: center;
  margin: auto;
  margin-top: 0px;
  width: 426px;
  height: 266px;
`;

export const Input = styled.input`
  margin: auto;
  width: 100%;
  height: 41px;
  background-color: #f4f7fc;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 11px;
  font-size: 16px;
`;

export const SubmitButton = styled.button`
  width: 183px;
  height: 39px;
  background: #0165db;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;
export const ButtonName = styled.h3`
  color: #ffffff;
  text-transform: capitalize;
  margin: 0;
  font-size: 20px;
`;
