import { Request, Response } from 'express';
import MachinesService from '../services/machinesService';

class MachinesController {
  static listAllMachines = async (req: Request, res: Response) => {
    try {
      const machines = await MachinesService.getAllMachines();
      res.json(machines);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message || 'Failed to fetch machines' });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  };

  static registerMachine = async (req: Request, res: Response) => {
    const { name, type } = req.body;
    try {
      const newMachine = await MachinesService.createMachine(name, type);
      res.status(201).json(newMachine);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message || 'Failed to create machine' });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  };

  static editMachine = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, type } = req.body;
    try {
      const updatedMachine = await MachinesService.updateMachine(id, name, type);
      res.json(updatedMachine);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message || 'Failed to update machine' });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  };

  static deleteMachine = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await MachinesService.deleteMachine(id);
      res.status(204).end();
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message || 'Failed to delete machine' });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  };
}

export default MachinesController;
