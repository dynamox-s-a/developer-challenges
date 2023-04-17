import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, InputAdornment } from "@mui/material";
import Navbar from "@/components/Navbar";
import FeedbackMessage from "@/components/FeedbackMessage";

export default function Editar() {

  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [isPerishable, setIsPerishable] = useState(false);
  const [perishableDate, setPerishableDate] = useState("");
  const [productValue, setProductValue] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace("/login");
    }
    editProducts();
  }, [])

  const editProducts = () => {
    fetch(`http://localhost:8080/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setDate(data.manufacturing_date);
        setIsPerishable(data.is_perishable);
        setPerishableDate(data.expiration_date);
        setProductValue(data.price);
      });
  }

  const editDataProduct = (e) => {
    e.preventDefault();
    if (isPerishable && perishableDate <= date) {
      handleClickWarning();
      return;
    }
    const url = (`http://localhost:8080/products/${id}`);
    const options = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        name: name,
        manufacturing_date: date,
        is_perishable: isPerishable,
        expiration_date: isPerishable ? perishableDate : "",
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
      <form onSubmit={editDataProduct}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          height='90vh'
        >
          <h1>Editar produto</h1>
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
              value={date}
              fullWidth
            />

            <FormControl sx={{ mt: '20px' }} fullWidth focused>
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
                value={perishableDate}
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
              type="submit"
              variant="contained"
              sx={{ marginTop: "20px" }}
            >
              EDITAR
            </Button>


          </Box>
        </Box>
      </form>
    </div>
  )
}
