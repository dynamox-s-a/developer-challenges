"use client"

import { IconButton } from "@mui/material"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import { useThemeMode } from "@/context/ThemeContext"

export const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useThemeMode()

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  )
}
