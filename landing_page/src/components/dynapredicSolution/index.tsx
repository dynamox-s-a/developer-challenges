import React from "react";
import { Box, Typography } from "@mui/material";
import "./dynapredic.css";
import DesktopAndMobile from "../../images/desktop-and-mobile.png";
import DynaPredictLogo from "../../images/logo-dynapredict.png";

export default function DynapredicSolution(): JSX.Element {
  return (
    <Box sx={{ flexGrow: 1 }} className="dynapredicBox">
      <Box className="dynapredicSolution">
        <Typography variant="h4" component="h2">
          Solução DynaPredict
        </Typography>
        <img src={DynaPredictLogo} alt="teste" className="dynapredicImg" />
      </Box>
      <img
        src={DesktopAndMobile}
        alt="Desktop and Mobile Image"
        className="desktopAndMobileImg"
      />
    </Box>
  );
}
