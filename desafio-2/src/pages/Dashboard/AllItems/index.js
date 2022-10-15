import React, { useEffect, useState } from "react";
import axios from "axios";
import { SearchContanier, ItemsContainer } from "../../../components";

export const AllItems = () => {
  return (
    <>
      <SearchContanier />
      <ItemsContainer />
    </>
  );
};
