import express from 'express';
import { createMachine, updateMachine, deleteMachine } from '../controllers/machineController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, createMachine);
router.put('/:id', authMiddleware, updateMachine);
router.delete('/:id', authMiddleware, deleteMachine);

export default router;
