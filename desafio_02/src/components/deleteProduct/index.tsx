/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  deleteProduct,
  resetNewProductInfo,
  setProductID,
} from "../../redux/reducers/products";

export default function DeleteProduct(): JSX.Element {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const { productID } = useAppSelector((state) => state.productsSlice);

  const dispatch = useAppDispatch();

  const handleChangeItemInfo = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    switch (event.target.name) {
      case "productID":
        dispatch(setProductID(event.target.value));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const MIN_VALUE = 1;

    if (productID >= MIN_VALUE) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  });

  const handleDeleteProduct = async (): Promise<any> => {
    try {
      await dispatch(deleteProduct(productID));
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
        <Button
          variant="outlined"
          disabled={isDisabled}
          onClick={handleDeleteProduct as unknown as () => any}
        >
          Adicionar
        </Button>
      </Box>
    </Box>
  );
}
