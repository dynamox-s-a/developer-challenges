import { createAction } from '@reduxjs/toolkit';

// export const addMachineType = createAction('machineTypes/addMachineType', (newType) => ({
//     type: 'ADD_MACHINE_TYPE',
//     payload: newType,
// }));

// export const deleteMachineType = createAction('machineTypes/deleteMachineType', (machineTypeId) => ({
//     type: 'DELETE_MACHINE_TYPE',
//      payload: machineTypeId,
// }));

// export const setMachineTypes = createAction('machineTypes/setMachineTypes');



export const addMachine = createAction('machines/addMachine', (machine) => ({
    type: 'ADD_MACHINE',
    payload: machine,
}));

export const deleteMachine = createAction('machines/deleteMachine', (machineId) => ({
    type: 'DELETE_MACHINE',
    payload: machineId,

}));

export const setMachines = createAction('machines/setMachines');

