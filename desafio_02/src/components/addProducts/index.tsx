/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable complexity */
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Box, Button, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import "./addProducts.css";
import {
  setNewProductInfo,
  addNewProduct,
  resetNewProductInfo,
} from "../../redux/reducers/products";
import { IWrongInfo } from "../../interfaces/IWrongInfo";
import { ErrorAlert } from "../errorAlert";

export default function AddProduct(): JSX.Element {
  const [isExpirationDateDisabled, setIsExpirationDateDisabled] =
    useState<boolean>(true);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isWrongInfo, setWrongInfo] = useState<IWrongInfo>({
    isError: false,
    message: "",
  } as IWrongInfo);

  const { newProduct } = useAppSelector((state) => state.productsSlice);
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
        if (event.target.value === "sim") {
          dispatch(setNewProductInfo({ value: "", name: "expirationDate" }));
          setIsExpirationDateDisabled(false);
        } else {
          setIsExpirationDateDisabled(true);
          dispatch(setNewProductInfo({ value: "N/A", name: "expirationDate" }));
        }
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
      default:
        break;
    }
  };

  useEffect(() => {
    const MIN_LENGTH = 3;
    const MIN_PRICE_LENGTH = 1;
    let isExpirationDateValid = true;

    if (perishable === "sim") {
      const expirationDateObj = moment(expirationDate, "DD/MM/YYYY", true);
      const manufactureDateObj = moment(manufactureDate, "DD/MM/YYYY", true);
      isExpirationDateValid =
        expirationDateObj.isValid() &&
        manufactureDateObj.isBefore(expirationDateObj);
      setIsExpirationDateDisabled(false);
      if (!isExpirationDateValid) {
        setWrongInfo({
          isError: true,
          message: "Data de Validade não pode ser menor que Data de Fabricação",
        });
      } else {
        setWrongInfo({
          isError: false,
          message: "",
        });
      }
    } else {
      setIsExpirationDateDisabled(true);
      dispatch(setNewProductInfo({ value: "N/A", name: "expirationDate" }));
      setWrongInfo({
        isError: false,
        message: "",
      });
    }

    if (
      name.length >= MIN_LENGTH &&
      perishable.length >= MIN_LENGTH &&
      isExpirationDateValid &&
      price >= MIN_PRICE_LENGTH &&
      quantity >= MIN_PRICE_LENGTH
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [name, perishable, expirationDate, manufactureDate, price, quantity]);

  const handleAddNewProduct = async (): Promise<any> => {
    try {
      await dispatch(addNewProduct(newProduct)).unwrap();
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
          label="Data de Validade"
          name="expirationDate"
          value={expirationDate}
          onChange={handleChangeItemInfo}
          disabled={isExpirationDateDisabled}
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
          onClick={handleAddNewProduct as unknown as () => any}
        >
          Adicionar
        </Button>
      </Box>
      {isWrongInfo.isError && <ErrorAlert errorMessage={isWrongInfo.message} />}
    </Box>
  );
}
