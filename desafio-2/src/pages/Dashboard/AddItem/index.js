import React, { useEffect, useState } from "react";
import axios from "axios";
import { FormRow, FormRowSelect } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Form, FormCenter, BtnContanier, Section } from "./styles";
import { Button } from "../../../components/Button";
import {
  handleChange,
  clearValues,
  createItem,
} from "../../../features/Item/itemSlice";

export const AddItem = () => {
  const {
    isLoading,
    produto,
    fabDate,
    perishableOptions,
    perishable,
    validade,
    price,
    isEditing,
    editItemId,
  } = useSelector((store) => store.item);
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!produto || !fabDate || !price || !perishable) {
      toast.error("Preencha todos os campos!");
      return;
    }
    dispatch(createItem({ produto, fabDate, price, perishable, validade }));
    {
      /*const value = e.target.value;
    const data = Object.fromEntries(value);
    try {
      await axios.post(`http://localhost:3000/Products/${data.produto}`, {
        produto: data.produto,
        fabDate: Number(data.fabDate),
        validade: Number(data.validade),
        price: Number(data.price),
        perishable: data.perishable,
      });
      alert("Item criado com sucesso!");
    } catch (error) {
      console.log(error);
      alert("Erro ao criar o Item!");
    }*/
    }
  };

  const handleItemInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(handleChange({ name, value }));
  };
  return (
    <Section>
      <Form onSubmit={handleSubmit}>
        <h2>{isEditing ? "Edit Item" : "Add Item"}</h2>
        <FormCenter>
          <FormRow
            type="text"
            name="produto"
            value={produto}
            handleChange={handleItemInput}
            placeholder="nome do Produto"
          ></FormRow>
          <FormRow
            type="number"
            name="fabDate"
            labelText="Data de fabricação"
            value={fabDate}
            handleChange={handleItemInput}
            placeholder="Data de fabricação"
          ></FormRow>
          <FormRowSelect
            labelText="Perecível"
            name="perishable"
            value={perishable}
            handleChange={handleItemInput}
            list={perishableOptions}
          />

          <FormRow
            type="number"
            name="validade"
            labelText="Data de validade"
            value={validade}
            handleChange={handleItemInput}
            placeholder="Data de validade"
          ></FormRow>
          <FormRow
            type="text"
            name="price"
            labelText="valor"
            value={price}
            handleChange={handleItemInput}
            placeholder="Valor"
          ></FormRow>
          <BtnContanier>
            <Button
              type="button"
              title="Limpar"
              onClick={() => dispatch(clearValues())}
            ></Button>
            <Button type="submit" title="submit"></Button>
          </BtnContanier>
        </FormCenter>
      </Form>
    </Section>
  );
};
