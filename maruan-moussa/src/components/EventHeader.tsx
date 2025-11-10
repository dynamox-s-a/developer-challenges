"use client";

import { Box, Button, TextField, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface EventHeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  onAddEvent: () => void;
}

export const EventHeader = ({ filter, setFilter, onAddEvent }: EventHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1023px)");
  const isLight = theme.palette.mode === "light";

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      justifyContent="space-between"
      alignItems={isMobile ? "stretch" : "center"}
      gap={isMobile ? 1.5 : 0}
      p={2.5}
      sx={{
        background: isLight
          ? "linear-gradient(90deg, rgba(59,130,246,0.15), rgba(124,58,237,0.15))"
          : "linear-gradient(90deg, rgba(59,130,246,0.12), rgba(124,58,237,0.12))",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backdropFilter: "blur(8px)",
        borderBottom: isLight
          ? "1px solid rgba(0,0,0,0.05)"
          : "1px solid rgba(255,255,255,0.08)",
        transition: "background-color 0.3s ease, border 0.3s ease",
      }}
    >
      <TextField
        placeholder="Buscar evento..."
        size="small"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        fullWidth={isMobile}
        sx={{
          width: isMobile ? "100%" : isTablet ? "60%" : "40%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: isLight
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(255, 255, 255, 0.08)",
            "& fieldset": { border: "none" },
          },
          "& .MuiInputBase-input": {
            color: isLight ? "#111" : "#f5f5f5",
            "::placeholder": {
              color: isLight
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.75)",
              opacity: 1,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <SearchIcon
              sx={{
                ml: 1,
                color: isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.6)",
              }}
            />
          ),
        }}
      />
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddEvent}
        sx={{
          mt: isMobile ? 2 : 0,
          width: isMobile ? "100%" : "auto",
          minWidth: isMobile ? "100%" : "160px",
          borderRadius: "10px",
          fontWeight: 600,
          px: isMobile ? 0 : 3,
          py: isMobile ? 1.4 : 0.9,
          fontSize: isMobile ? "0.95rem" : "1rem",
          background: "linear-gradient(90deg, #3b82f6, #7c3aed)",
          color: "#fff",
          textTransform: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          "&:hover": {
            background: "linear-gradient(90deg, #2563eb, #6d28d9)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
          },
        }}
      >
        Novo Evento
      </Button>
    </Box>
  );
};
