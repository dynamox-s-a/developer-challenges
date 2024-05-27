import { Helmet } from "react-helmet-async";
import { Container, Typography } from "@mui/material";
import { MachineCards } from "../_components/machineCards/machine-cards";
import { useAppDispatch, useAppSelector } from "../store";
import { useEffect } from "react";
import { MachineCardsContainer } from "../Pages/Data/data.styles";
import { loadMachineData } from "./eduStore/ThunkSliceExemple";

//machine dava não estará funcionando porque desativei/tirei o provider store={edu} do app.js

export function Data(){
  const dispatch = useAppDispatch()
  const machineData = useAppSelector(store => { return store.machineData.data })
  const isMachineDataLoading = useAppSelector(state => state.machineData.isLoading)

  console.log(machineData)

  useEffect(() => {
    dispatch(loadMachineData())
  },[])

  return(
    <>
      <Helmet title="Data" />
      <Container sx={{display: "flex", flexDirection: 'column', gap: '16px', padding: { xs: '24px', md: '80px'}}}>
        <Typography sx={{ paddingBottom: { xs: '8px', md: '16px'}, fontWeight: '600', fontSize: { xs: '1.5rem', md: '2.5rem'} }}>Análise de dados</Typography>
        <MachineCardsContainer>
          <MachineCards />
        </MachineCardsContainer>

        { isMachineDataLoading ? (
          <div>isLoading</div>
        ) : (
          <div>Chart</div>
        )}
        
      </Container>
    </>
  )
}