import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";

import { useAppDispatch } from "../../store";
import { useEffect } from "react";
import { getMeasuresFetch, setScope } from "../../store/slices/measuresSlice";

import { getMachineDataFetch } from "../../store/slices/machineSlice";

import { TitlePage } from "../../_components/ui/title-page";
import { MachineInformationSection } from "../../_components/sections/machine-information";
import { DataChartsSection } from "../../_components/sections/datacharts";
import { Footer } from "../../_components/sections/footer";

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
    dispatch(getMachineDataFetch())
  }, [dispatch]);

  return (
    <>
      <Helmet title="Data" />
      <Container sx={{ display: "flex", flexDirection: 'column', gap: '16px', padding: { xs: '24px', md: '80px' } }}>
        <TitlePage>Data</TitlePage>

        <MachineInformationSection />
        <DataChartsSection />

        <Footer/>
        
      </Container>
    </>
  );
}
