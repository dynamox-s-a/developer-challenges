import React, { useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, InputAdornment } from "@mui/material";
import Navbar from "@/components/Navbar";
import FeedbackMessage from "@/components/FeedbackMessage";

export default function Criar() {

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [isPerishable, setIsPerishable] = useState(false);
  const [perishableDate, setPerishableDate] = useState("");
  const [productValue, setProductValue] = useState(0);

  const createProduct = (e) => {
    e.preventDefault();
    if (isPerishable && perishableDate <= date) {
      handleClickWarning();
      return;
    }
    const url = "http://localhost:8080/products";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        name: name,
        manufacturing_date: date,
        is_perishable: isPerishable,
        expiration_date: perishableDate,
        price: Number(productValue)
      }),
    };
    fetch(url, options)
      .then(() => {
        handleSuccess();
      }).catch(() => {
        handleError();
      })
      ;
  }

  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(true);
  };

  const [openError, setOpenError] = useState(false);

  const handleError = () => {
    setOpenError(true);
  };

  const [openWarning, setOpenWarning] = useState(false);

  const handleClickWarning = () => {
    setOpenWarning(true);
  };

  return (
    <div>
      <Navbar />
      <FeedbackMessage open={open} setOpen={setOpen} severity={"success"}>
        Operação feita com sucesso!
      </FeedbackMessage>
      <FeedbackMessage open={openError} setOpen={setOpenError} severity={"error"}>
        Operação falhou!
      </FeedbackMessage>
      <FeedbackMessage open={openWarning} setOpen={setOpenWarning} severity={"warning"}>
        A data de fabricação não pode ser maior que a de validade!
      </FeedbackMessage>
      <Box maxWidth="400px" mx="auto">
        <form onSubmit={createProduct}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height='90vh'
          >
            <h1>Cadastro de produtos</h1>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >

              <TextField
                label="Nome produto"
                variant="outlined"
                focused
                sx={{ marginTop: "20px" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />

              <TextField
                type="date"
                label="Data Fabricação"
                variant="outlined"
                focused
                sx={{ marginTop: "20px" }}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
              />

              <FormControl
                fullWidth
                focused
                sx={{ mt: "20px" }}
              >
                <InputLabel>
                  É perecível?
                </InputLabel>
                <Select
                  value={isPerishable}
                  label="É perecível?"
                  onChange={(e) => setIsPerishable(e.target.value)}
                >
                  <MenuItem value={false}>Não</MenuItem>
                  <MenuItem value={true}>Sim</MenuItem>
                </Select>
              </FormControl>

              {isPerishable === true && (
                <TextField
                  type="date"
                  label="Data validade"
                  variant="outlined"
                  focused
                  sx={{ marginTop: "20px" }}
                  onChange={(e) => setPerishableDate(e.target.value)}
                  fullWidth
                />
              )}

              <TextField
                type="number"
                label="Preço"
                variant="outlined"
                focused
                sx={{ marginTop: "20px" }}
                onChange={(e) => setProductValue(e.target.value)}
                value={productValue}
                placeholder="Ex: 50.0"
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
                required
                fullWidth
              />

              <Button
                variant="contained"
                sx={{ marginTop: "20px" }}
                type="submit"
              >
                Cadastrar
              </Button>

            </Box>
          </Box>
        </form>
      </Box>
    </div>
  )
}
