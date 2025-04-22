"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const machinesService_1 = __importDefault(require("../services/machinesService"));
class MachinesController {
}
_a = MachinesController;
MachinesController.listAllMachines = async (req, res) => {
    try {
        const machines = await machinesService_1.default.getAllMachines();
        res.json(machines);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message || 'Failed to fetch machines' });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};
MachinesController.registerMachine = async (req, res) => {
    const { name, type } = req.body;
    try {
        const newMachine = await machinesService_1.default.createMachine(name, type);
        res.status(201).json(newMachine);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message || 'Failed to create machine' });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
};
MachinesController.editMachine = async (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;
    try {
        const updatedMachine = await machinesService_1.default.updateMachine(id, name, type);
        res.json(updatedMachine);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message || 'Failed to update machine' });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
};
MachinesController.deleteMachine = async (req, res) => {
    const { id } = req.params;
    try {
        await machinesService_1.default.deleteMachine(id);
        res.status(204).end();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message || 'Failed to delete machine' });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
};
exports.default = MachinesController;
