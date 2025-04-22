import { Machine } from '../models/Machine';

class MachinesService {
  static async getAllMachines() {
    try {
      return await Machine.find();
    } catch (error) {
      throw new Error('Failed to fetch machines');
    }
  }

  static async createMachine(name: string, type: string) {
    try {
      const newMachine = new Machine({ name, type });
      await newMachine.save();
      return newMachine;
    } catch (error) {
      throw new Error('Failed to create machine');
    }
  }

  static async updateMachine(id: string, name: string, type: string) {
    try {
      const updatedMachine = await Machine.findByIdAndUpdate(
        id,
        { name, type },
        { new: true }
      );
      if (!updatedMachine) {
        throw new Error('Machine not found');
      }
      return updatedMachine;
    } catch (error) {
      throw new Error('Failed to update machine');
    }
  }

  static async deleteMachine(id: string) {
    try {
      await Machine.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Failed to delete machine');
    }
  }
}

export default MachinesService;
