"use client";

import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";

interface EventFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const categories = [
  "Todas",
  "Conferência",
  "Workshop",
  "Webinar",
  "Networking",
  "Outro",
];

export default function EventFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
}: EventFiltersProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        flexDirection: {
          xs: "column",
          md: "row",
        },

        alignItems: {
          xs: "stretch",
          md: "center",
        },
      }}
    >
      <TextField
        placeholder="Buscar eventos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flexGrow: 1, minWidth: "250px" }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          },
        }}
      />

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Categoria</InputLabel>
        <Select
          value={categoryFilter}
          label="Categoria"
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Ordenar por</InputLabel>
        <Select
          value={sortBy}
          label="Ordenar por"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <MenuItem value="date-asc">Data (Mais próxima)</MenuItem>
          <MenuItem value="date-desc">Data (Mais distante)</MenuItem>
          <MenuItem value="name-asc">Nome (A-Z)</MenuItem>
          <MenuItem value="name-desc">Nome (Z-A)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
