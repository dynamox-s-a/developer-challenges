
import { Helmet } from "react-helmet-async";
import { Container, Typography } from "@mui/material";
import { MachineCardsContainer } from "./data.styles";
import { MachineCards } from "../../_components/machineCards/machine-cards";
import { useAppDispatch } from "../../store";
import { useEffect, useState } from "react";
import { getMeasuresFetch } from "../../store/slices/measuresSlice";
import { DynamicDataChart } from "./dynamic-datachart";

export function Data() {
  const dispatch = useAppDispatch();

    // Validação tamanho da tela
  const [isSmallScreen, setisSmallScreen] = useState(false)

  const [scope, setScope] = useState('lastWeek')

  const handleScopeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setScope(event.target.value);
  };
 
   useEffect(() => {
     // Function to check screen size
     function checkScreenSize() {
       setisSmallScreen(window.innerWidth <= 768)
     }
 
     // Initial check
     checkScreenSize()
 
     // Add event listener for window resize
     window.addEventListener('resize', checkScreenSize)
 
     // Cleanup event listener on component unmount
     return () => window.removeEventListener('resize', checkScreenSize)
   }, [])

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
      

        {!isSmallScreen ? (
          <>
            <select name="scopeSelect" id="scopeSelect" onChange={handleScopeChange} value={scope}>
              <option value="lastDay">ultimo dia</option>
              <option value="lastWeek">ultima semana</option>
              <option value="lastMonth">ultimo mês</option>
              <option value="lastYear">ultimo ano</option>
              <option value="">Tudo</option>
            </select>
            <DynamicDataChart scope={scope}/>
          </>
        ): (
          <>
            <select name="scopeSelect" id="scopeSelect" onChange={handleScopeChange} value={scope}>
              <option value="lastDay">ultimo dia</option>
              <option value="lastWeek">ultima semana</option>
              <option value="lastMonth">ultimo mês</option>
              <option value="lastYear">ultimo ano</option>
              <option value="">Tudo</option>
            </select>
            <DynamicDataChart scope={scope}/>
          </>
        )}
      </Container>
    </>
  );
}
