import React from "react";
import { B, Title } from "./styles";

export const Button = ({ title, onClick }) => {
  return (
    <B onClick={onClick}>
      <Title>{title}</Title>
    </B>
  );
};
