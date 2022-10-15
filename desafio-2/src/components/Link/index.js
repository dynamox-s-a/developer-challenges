import React from "react";
import { Link, Title } from "./styles";

export const Linkbtn = ({ href, title }) => {
  return (
    <Link href={href}>
      <Title>{title}</Title>
    </Link>
  );
};
