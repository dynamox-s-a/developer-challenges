import { Request, Response } from 'express';
import { Machine } from '../models/Machine';

class MachinesController {
  static listAllMachines = async (req: Request, res: Response) => {
    try {
      const machines = await Machine.find();
      res.json(machines);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch machines' });
    }
  };

  static registerMachine = async (req: Request, res: Response) => {
    const { name, type } = req.body;
    try {
      const newMachine = new Machine({ name, type });
      await newMachine.save();
      res.status(201).json(newMachine);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create machine' });
    }
  };

  static editMachine = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, type } = req.body;
    try {
      const updatedMachine = await Machine.findByIdAndUpdate(
        id,
        { name, type },
        { new: true }
      );
      if (!updatedMachine) {
        return res.status(404).json({ error: 'Machine not found' });
      }
      res.json(updatedMachine);
    } catch {
      res.status(400).json({ error: 'Failed to update machine' });
    }
  };

  static deleteMachine = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await Machine.findByIdAndDelete(id);
      res.status(204).end();
    } catch {
      res.status(400).json({ error: 'Failed to delete machine' });
    }
  };
}

export default MachinesController;
