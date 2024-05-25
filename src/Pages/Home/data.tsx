import { Helmet } from "react-helmet-async";
import { Container, Typography } from "@mui/material";
import { MachineCardsContainer } from "./data.styles";
import { MachineCards } from "../../_components/machineCards/machine-cards";

export function Data(){
  return(
    <>
      <Helmet title="Data" />
      <Container sx={{display: "flex", flexDirection: 'column', gap: '16px', padding: { xs: '24px', md: '80px'}}}>
        <Typography sx={{ paddingBottom: { xs: '8px', md: '16px'}, fontWeight: '600', fontSize: { xs: '1.5rem', md: '2.5rem'} }}>Análise de dados</Typography>
        <MachineCardsContainer>
          <MachineCards />
        </MachineCardsContainer>
      </Container>
    </>
  )
}