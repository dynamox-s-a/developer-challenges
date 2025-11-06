"use client";

import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onItemsPerPageChange,
  onPrevPage,
  onNextPage,
  isFirstPage,
  isLastPage,
}: PaginationControlsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 0,
        px: 2,
        py: 1.5,
        borderTop: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "0 0 16px 16px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Select
          size="small"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          sx={{
            borderRadius: "12px",
            fontWeight: 500,
            "& .MuiSelect-select": {
              py: 0.5,
              px: 1.5,
            },
          }}
        >
          {[5, 10, 25].map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt} por página
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* 📄 Navegação */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
          Página {currentPage} de {totalPages}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            disabled={isFirstPage}
            onClick={onPrevPage}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              py: 0.5,
              color: isFirstPage ? "text.disabled" : "text.primary",
              borderColor: "rgba(0,0,0,0.1)",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            Anterior
          </Button>

          <Button
            variant="contained"
            disabled={isLastPage}
            onClick={onNextPage}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 0.5,
              background: "linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #2563EB 0%, #6D28D9 100%)",
              },
            }}
          >
            Próximo
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
