"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Toolbar,
  CircularProgress,
  Alert,
  debounce,
} from "@mui/material";
import { Pencil, Trash } from "@phosphor-icons/react/dist/ssr";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { Machine } from "@/types/machines";
import UpdateMachineDialog from "./updateMachineDialog";
import DeleteMachineDialog from "./deleteMachineDialog";
import { deleteMachineThunk, fetchMachines } from "@/redux/machines/thunks";

// Define constants to avoid magic strings
const MACHINE_TYPES = {
  PUMP: "Pump",
  FAN: "Fan",
} as const;

// Define interface for the component's state
interface FilterState {
  searchQuery: string;
  selectedType: string;
}

const MachinesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { machines, isLoading, error } = useAppSelector((state) => state.machines);

  // Combine related state into an object
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedType: "",
  });

  // Modal states
  const [modalState, setModalState] = useState({
    isUpdateOpen: false,
    isDeleteOpen: false,
    selectedMachine: null as Machine | null,
  });

  // Fetch machines on component mount
  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  // Memoize the filtered machines to prevent unnecessary recalculations
  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      const matchesSearch = filters.searchQuery
        ? machine.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          machine.type.toLowerCase().includes(filters.searchQuery.toLowerCase())
        : true;
      
      const matchesType = filters.selectedType
        ? machine.type === filters.selectedType
        : true;

      return matchesSearch && matchesType;
    });
  }, [machines, filters.searchQuery, filters.selectedType]);

  // Debounced search handler to improve performance
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters((prev) => ({ ...prev, searchQuery: value }));
    }, 300),
    []
  );

  // Event handlers
  const handleTypeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, selectedType: value }));
  };

  const handleUpdateMachine = (machine: Machine) => {
    setModalState({
      isUpdateOpen: true,
      isDeleteOpen: false,
      selectedMachine: machine,
    });
  };

  const handleDeleteMachine = (machine: Machine) => {
    setModalState({
      isUpdateOpen: false,
      isDeleteOpen: true,
      selectedMachine: machine,
    });
  };

  const handleCloseModals = () => {
    setModalState({
      isUpdateOpen: false,
      isDeleteOpen: false,
      selectedMachine: null,
    });
  };

  const handleConfirmDelete = async () => {
    if (modalState.selectedMachine?.id) {
      await dispatch(deleteMachineThunk(modalState.selectedMachine.id));
      handleCloseModals();
    }
  };

  // Render helpers
  const renderToolbar = () => (
    <Toolbar sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
      <TextField
        label="Search machines..."
        variant="outlined"
        size="small"
        onChange={(e) => debouncedSearch(e.target.value)}
        sx={{ width: 250 }}
      />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Machine Type</InputLabel>
        <Select
          value={filters.selectedType}
          onChange={(e) => handleTypeChange(e.target.value)}
          label="Machine Type"
          sx={{ width: 200 }}
        >
          <MenuItem value="">All Types</MenuItem>
          {Object.values(MACHINE_TYPES).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Toolbar>
  );

  const renderTableContent = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography fontWeight={600}>Machine Name</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight={600}>Machine Type</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography fontWeight={600}>Actions</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredMachines.map((machine) => (
            <TableRow key={machine.id} hover>
              <TableCell>
                <Typography>{machine.name}</Typography>
              </TableCell>
              <TableCell>{machine.type}</TableCell>
              <TableCell align="right">
                <Tooltip title="Edit machine">
                  <IconButton
                    onClick={() => handleUpdateMachine(machine)}
                    aria-label="Edit machine"
                  >
                    <Pencil />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete machine">
                  <IconButton
                    onClick={() => handleDeleteMachine(machine)}
                    aria-label="Delete machine"
                  >
                    <Trash />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box component="section" aria-label="Machines management">
      {renderToolbar()}

      <Box sx={{ overflowX: "auto", maxHeight: "600px" }}>
        {isLoading ? (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <CircularProgress aria-label="Loading machines" />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : filteredMachines.length > 0 ? (
          renderTableContent()
        ) : (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Typography color="text.secondary">
              No machines match your search criteria
            </Typography>
          </Box>
        )}

        <UpdateMachineDialog
          open={modalState.isUpdateOpen}
          onClose={handleCloseModals}
          machine={modalState.selectedMachine}
        />

        <DeleteMachineDialog
          open={modalState.isDeleteOpen}
          onClose={handleCloseModals}
          machine={modalState.selectedMachine}
          onDelete={handleConfirmDelete}
        />
      </Box>
    </Box>
  );
};

export default MachinesList;