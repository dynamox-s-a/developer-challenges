import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Items } from "../Items";
import axios from "axios";
import { Section, Titulo, LocalItens } from "./style";

export const ItemsContainer = () => {
  const { isLoading } = useSelector((store) => store.allitems);
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3002/Products").then((response) => {
      setAllItems(response.data);
    });
  }, [allItems]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (allItems.length === 0) {
    return <h2>nao foi encontrado resultado para a pesquisa</h2>;
  }

  return (
    <Section>
      <Titulo>Items</Titulo>
      <LocalItens>
        {allItems.map((item) => {
          return <Items key={item.id} {...item}></Items>;
        })}
      </LocalItens>
    </Section>
  );
};
