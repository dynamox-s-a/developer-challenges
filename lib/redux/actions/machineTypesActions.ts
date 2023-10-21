import { createAction } from '@reduxjs/toolkit';

// export const addMachineType = (machineType: MachineType) => {
//     return {
//       type: 'ADD_MACHINE_TYPE',
//       payload: machineType,
//     };
//   };
  
//   export const deleteMachineType = (machineTypeId: number) => {
//     return {
//       type: 'DELETE_MACHINE_TYPE',
//       payload: machineTypeId,
//     };
//   };
  

  export const addMachineType = createAction('machineTypes/addMachineType', (newType) => ({
    type: 'ADD_MACHINE_TYPE',
    payload: newType,
}));

export const deleteMachineType = createAction('machineTypes/deleteMachineType', (machineTypeId) => ({
    type: 'DELETE_MACHINE_TYPE',
     payload: machineTypeId,
}));

export const setMachineTypes = createAction('machineTypes/setMachineTypes');

