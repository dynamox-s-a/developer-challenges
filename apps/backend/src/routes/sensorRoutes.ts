import express from 'express';
import { getSensorsForMonitoring, addSensor, deleteSensor, getSensorById, updateSensor } from '../controllers/sensorController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router({ mergeParams: true });

// Rota para obter todos os sensores e adicionar um novo sensor
router.route('/')
  .get(protect, getSensorsForMonitoring)
  .post(protect, addSensor);

// Rota para deletar um sensor específico
router.route('/:sensorId')
  .get(protect, getSensorById) // Adicione essa rota para buscar os dados do sensor
  .put(protect, updateSensor)  // Adicione essa rota para atualizar o sensor
  .delete(protect, deleteSensor);


export default router;
