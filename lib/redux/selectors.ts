import { createSelector } from '@reduxjs/toolkit';

// Seletor para obter as máquinas do estado
export const selectMachines = createSelector(
  (state) => state.machines, 
  (machines) => machines
);