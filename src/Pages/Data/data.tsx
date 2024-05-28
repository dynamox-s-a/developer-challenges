import { Helmet } from "react-helmet-async";
import { Container, Typography } from "@mui/material";
import { MachineCardsContainer } from "./data.styles";
import { MachineCards } from "../../_components/machineCards/machine-cards";
import { useAppDispatch } from "../../store";
import { useEffect } from "react";
import { getMeasuresFetch, setScope } from "../../store/slices/measuresSlice";
import { TemperatureChart } from "../../_components/charts/temperature-chart";
import { AcelerationChart } from "../../_components/charts/aceleration-chart";
import { VelocityChart } from "../../_components/charts/velocity-chart";

export function Data() {
  const dispatch = useAppDispatch();

   useEffect(() => {
     // Function to check screen size
     function checkScreenSize() {
       if(window.innerWidth <= 768) {
        dispatch(setScope({
          type: 'responsiveChange',
          selectScope: 'lastDay'
        }))
       } else {
        dispatch(setScope({
          type: 'responsiveChange',
          selectScope: 'lastMonth'
        }))
       }
     }

     // Initial check
     checkScreenSize()
 
     // Add event listener for window resize
     window.addEventListener('resize', checkScreenSize)
 
     // Cleanup event listener on component unmount
     return () => window.removeEventListener('resize', checkScreenSize)
   }, [dispatch])

  useEffect(() => {
    dispatch(getMeasuresFetch());
  }, [dispatch]);

  return (
    <>
      <Helmet title="Data" />
      <Container sx={{ display: "flex", flexDirection: 'column', gap: '16px', padding: { xs: '24px', md: '80px' } }}>
        <Typography sx={{ paddingBottom: { xs: '8px', md: '16px' }, fontWeight: '600', fontSize: { xs: '1.5rem', md: '2.5rem' } }}>
          Análise de dados
        </Typography>
        <MachineCardsContainer>
          <MachineCards />
        </MachineCardsContainer>
      
        <AcelerationChart />
        <VelocityChart />
        <TemperatureChart />

      </Container>
    </>
  );
}
