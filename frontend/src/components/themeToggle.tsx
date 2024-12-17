import React, { useContext } from "react";
import { IconButton } from "@mui/material";
import { ThemeContext } from "@/context/ThemeProvider";
import { DarkMode, LightMode } from "@mui/icons-material";

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {isDarkMode ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
};

export default ThemeToggle;
