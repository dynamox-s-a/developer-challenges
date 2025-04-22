import express from 'express';
import MonitoringPointController from '../controllers/monitoringPointsController';

const router = express.Router();

router.post('/', MonitoringPointController.create);
router.get('/', MonitoringPointController.listPaginated);

export default router;
