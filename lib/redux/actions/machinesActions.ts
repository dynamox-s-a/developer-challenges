import { createAction } from '@reduxjs/toolkit';

export const addMachine = createAction('machines/addMachine', (machine) => ({
    type: 'ADD_MACHINE',
    payload: machine,
}));

export const deleteMachine = createAction('machines/deleteMachine', (machineId) => ({
    type: 'DELETE_MACHINE',
    payload: machineId,

}));

export const setMachines = createAction('machines/setMachines');

export const consultMachines = createAction('machines/consultMachines');

export const setNewMachineNameInput = createAction('machinesForm/setNewMachineNameInput');
export const setNewMachineName = createAction('machinesForm/setNewMachineName');
export const setNewMachineSector = createAction('machinesForm/setNewMachineSector');
export const setSelectedMachine = createAction('machinesForm/setSelectedMachine');
export const setSelectedMachineId = createAction('machinesForm/setSelectedMachineId');
export const setSelectedSector = createAction('machinesForm/setSelectedSector');
export const setSelectedMachineTypeSelected = createAction('machinesForm/setSelectedMachineTypeSelected');
