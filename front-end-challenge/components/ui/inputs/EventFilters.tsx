import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { formatEventCategory } from "../../../utils";

interface EventFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  locationFilter: string;
  sortBy: "date" | "name";
  sortOrder: "asc" | "desc";
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSortByChange: (value: "date" | "name") => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
  onClearFilters: () => void;
}

export default function EventFilters({
  searchTerm,
  categoryFilter,
  locationFilter,
  sortBy,
  sortOrder,
  categories,
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  onSortByChange,
  onSortOrderChange,
  onClearFilters,
}: EventFiltersProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          placeContent: "center",
        }}
      >
        <TextField
          label="Pesquisar eventos"
          placeholder="Nome ou descrição..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={categoryFilter}
            label="Categoria"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {formatEventCategory(category)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Local"
          placeholder="Filtrar por local..."
          value={locationFilter}
          onChange={(e) => onLocationChange(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={sortBy}
            label="Ordenar por"
            onChange={(e) => onSortByChange(e.target.value as "date" | "name")}
          >
            <MenuItem value="date">Data</MenuItem>
            <MenuItem value="name">Nome</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Ordem</InputLabel>
          <Select
            value={sortOrder}
            label="Ordem"
            onChange={(e) =>
              onSortOrderChange(e.target.value as "asc" | "desc")
            }
          >
            <MenuItem value="asc">
              {sortBy === "date" ? "Mais antigo" : "A → Z"}
            </MenuItem>
            <MenuItem value="desc">
              {sortBy === "date" ? "Mais recente" : "Z → A"}
            </MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={onClearFilters}>
          Limpar Filtros
        </Button>
      </Box>
    </Box>
  );
}
