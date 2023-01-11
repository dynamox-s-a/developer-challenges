/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Box, Button, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  setNewProductInfo,
  editProduct,
  resetNewProductInfo,
  setProductID,
} from "../../redux/reducers/products";
import { IProduct } from "../../redux/interfaces/IProducts";
import { IWrongInfo } from "../../interfaces/IWrongInfo";
import { ErrorAlert } from "../errorAlert";

export default function EditProduct(): JSX.Element {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isExpirationDateDisabled, setIsExpirationDateDisabled] =
    useState<boolean>(true);
  const [isWrongInfo, setWrongInfo] = useState<IWrongInfo>({
    isError: false,
    message: "",
  } as IWrongInfo);

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
          setNewProductInfo({
            value: event.target.value,
            name: "productName",
          })
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
          onClick={handleEditProduct as unknown as () => any}
        >
          Adicionar
        </Button>
      </Box>
      {isWrongInfo.isError && <ErrorAlert errorMessage={isWrongInfo.message} />}
    </Box>
  );
}