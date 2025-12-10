"use client";

import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import type { EventCategory, EventFilters as EventFiltersType } from "@/types";
import { EVENT_CATEGORIES } from "../constants";

interface EventFiltersProps {
  filters: EventFiltersType;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: EventCategory | "") => void;
  onSortFieldChange: (field: "name" | "dateTime") => void;
  onSortOrderToggle: () => void;
  onReset: () => void;
}

export function EventFilters({
  filters,
  onSearchChange,
  onCategoryChange,
  onSortFieldChange,
  onSortOrderToggle,
  onReset,
}: EventFiltersProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    onCategoryChange(event.target.value as EventCategory | "");
  };

  const handleSortFieldChange = (
    _event: React.MouseEvent<HTMLElement>,
    newField: "name" | "dateTime" | null,
  ) => {
    if (newField !== null) {
      onSortFieldChange(newField);
    }
  };

  const hasActiveFilters = filters.search || filters.category;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        alignItems: { xs: "stretch", md: "center" },
        flexWrap: "wrap",
      }}
    >
      {/* Search Field */}
      <TextField
        placeholder="Search events..."
        value={filters.search}
        onChange={handleSearchChange}
        size="small"
        sx={{ minWidth: 250, flexGrow: 1, maxWidth: { md: 350 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: filters.search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Category Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="category-filter-label">Category</InputLabel>
        <Select
          labelId="category-filter-label"
          id="category-filter"
          value={filters.category}
          label="Category"
          onChange={handleCategoryChange}
        >
          <MenuItem value="">All Categories</MenuItem>
          {EVENT_CATEGORIES.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sort Controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ToggleButtonGroup
          value={filters.sortField}
          exclusive
          onChange={handleSortFieldChange}
          size="small"
          aria-label="Sort by"
        >
          <ToggleButton value="dateTime" aria-label="Sort by date">
            Date
          </ToggleButton>
          <ToggleButton value="name" aria-label="Sort by name">
            Name
          </ToggleButton>
        </ToggleButtonGroup>

        <Tooltip
          title={`Sort ${filters.sortOrder === "asc" ? "descending" : "ascending"}`}
        >
          <IconButton
            onClick={onSortOrderToggle}
            size="small"
            aria-label={`Sort ${filters.sortOrder === "asc" ? "descending" : "ascending"}`}
          >
            <SortIcon
              sx={{
                transform: filters.sortOrder === "desc" ? "scaleY(-1)" : "none",
                transition: "transform 0.2s ease-in-out",
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <Tooltip title="Reset filters">
          <IconButton
            onClick={onReset}
            size="small"
            color="primary"
            aria-label="Reset filters"
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
