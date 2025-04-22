"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Machine_1 = require("../models/Machine");
class MachinesService {
    static async getAllMachines() {
        try {
            return await Machine_1.Machine.find();
        }
        catch (error) {
            throw new Error('Failed to fetch machines');
        }
    }
    static async createMachine(name, type) {
        try {
            const newMachine = new Machine_1.Machine({ name, type });
            await newMachine.save();
            return newMachine;
        }
        catch (error) {
            throw new Error('Failed to create machine');
        }
    }
    static async updateMachine(id, name, type) {
        try {
            const updatedMachine = await Machine_1.Machine.findByIdAndUpdate(id, { name, type }, { new: true });
            if (!updatedMachine) {
                throw new Error('Machine not found');
            }
            return updatedMachine;
        }
        catch (error) {
            throw new Error('Failed to update machine');
        }
    }
    static async deleteMachine(id) {
        try {
            await Machine_1.Machine.findByIdAndDelete(id);
        }
        catch (error) {
            throw new Error('Failed to delete machine');
        }
    }
}
exports.default = MachinesService;
