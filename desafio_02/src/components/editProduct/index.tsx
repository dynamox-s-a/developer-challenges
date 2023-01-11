/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  setNewProductInfo,
  editProduct,
  resetNewProductInfo,
  setProductID,
} from "../../redux/reducers/products";
import { IProduct } from "../../redux/interfaces/IProducts";

export default function EditProduct(): JSX.Element {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const { newProduct, productID } = useAppSelector(
    (state) => state.productsSlice
  );
  const { name, perishable, expirationDate, manufactureDate, price, quantity } =
    newProduct;

  const dispatch = useAppDispatch();

  const handleChangeItemInfo = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    switch (event.target.name) {
      case "productName":
        dispatch(
          setNewProductInfo({ value: event.target.value, name: "productName" })
        );
        break;
      case "perishable":
        dispatch(
          setNewProductInfo({
            value: event.target.value,
            name: "perishable",
          })
        );
        break;
      case "expirationDate":
        dispatch(
          setNewProductInfo({
            value: event.target.value,
            name: "expirationDate",
          })
        );
        break;
      case "manufactureDate":
        dispatch(
          setNewProductInfo({
            value: event.target.value,
            name: "manufactureDate",
          })
        );
        break;
      case "price":
        dispatch(
          setNewProductInfo({
            value: event.target.value,
            name: "price",
          })
        );
        break;
      case "quantity":
        dispatch(
          setNewProductInfo({
            value: event.target.value,
            name: "quantity",
          })
        );
        break;
      case "productID":
        dispatch(setProductID(event.target.value));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const MIN_LENGTH = 3;
    const MIN_PRICE_LENGTH = 1;

    if (
      name.length >= MIN_LENGTH &&
      perishable.length >= MIN_LENGTH &&
      expirationDate.length >= MIN_LENGTH &&
      manufactureDate.length >= MIN_LENGTH &&
      price >= MIN_PRICE_LENGTH &&
      quantity >= MIN_PRICE_LENGTH
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  });

  const handleEditProduct = async (): Promise<any> => {
    try {
      const newEditedProduct = {
        name,
        perishable,
        expirationDate,
        manufactureDate,
        price,
        quantity,
        id: productID,
      } as IProduct;
      await dispatch(editProduct(newEditedProduct));
      dispatch(resetNewProductInfo());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box component="section" sx={{ height: "100%" }}>
      <Box component="form" className="addFormBox">
        <TextField
          className="addFormInput"
          variant="outlined"
          label="ID do Produto"
          name="productID"
          value={productID}
          onChange={handleChangeItemInfo}
        />
        <TextField
          className="addFormInput"
          variant="outlined"
          label="Nome do Produto"
          name="productName"
          value={name}
          onChange={handleChangeItemInfo}
        />
        <TextField
          className="addFormInput"
          variant="outlined"
          label="Perecível"
          name="perishable"
          value={perishable}
          onChange={handleChangeItemInfo}
        />
        <TextField
          className="addFormInput"
          variant="outlined"
          label="Validade"
          name="expirationDate"
          value={expirationDate}
          onChange={handleChangeItemInfo}
        />
        <TextField
          className="addFormInput"
          variant="outlined"
          label="Fabricação"
          name="manufactureDate"
          value={manufactureDate}
          onChange={handleChangeItemInfo}
        />
        <TextField
          className="addFormInput"
          variant="outlined"
          label="Preço (R$)"
          name="price"
          value={price}
          onChange={handleChangeItemInfo}
        />
        <TextField
          className="addFormInput"
          variant="outlined"
          label="Quantidade"
          name="quantity"
          value={quantity}
          onChange={handleChangeItemInfo}
        />
        <Button
          variant="outlined"
          disabled={isDisabled}
          onClick={handleEditProduct as unknown as () => any}
        >
          Adicionar
        </Button>
      </Box>
    </Box>
  );
}
