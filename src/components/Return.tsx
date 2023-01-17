import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";

const Return = () => {
  return (
    <Link to="/home" className="flex text-white items-center gap-2">
      <AiOutlineArrowLeft />
      Voltar
    </Link>
  );
};

export default Return;
