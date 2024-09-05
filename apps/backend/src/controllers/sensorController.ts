import asyncHandler from "express-async-handler";
import Sensor from "../models/sensorModel";
import Monitoring from '../models/monitoringModel';
import { v4 as uuidv4 } from 'uuid';

// @desc Get all sensors for a specific monitoring
// @route GET /api/monitorings/:monitoringId/sensors
// @access Private
const getSensorsForMonitoring = asyncHandler(async (req, res) => {
  const sensors = await Sensor.find({ monitoring: req.params.monitoringId });

  if (sensors) {
    res.json(sensors);
  } else {
    res.status(404);
    throw new Error('No sensors found for this monitoring');
  }
});

// @desc Add a sensor
// @route POST /api/monitorings/:monitoringId/sensors
// @access Private
const addSensor = asyncHandler(async (req, res) => {
  const { name, status } = req.body;
  const monitoringId = req.params.monitoringId;

  // Verifica se o monitoramento existe
  const monitoring = await Monitoring.findById(monitoringId);
  if (!monitoring) {
    res.status(404);
    throw new Error('Monitoring not found');
  }

  const sensor = new Sensor({
    name,
    status,
    monitoring: monitoringId,
  });

  const createdSensor = await sensor.save();
  res.status(201).json(createdSensor);
});

// @desc Delete a sensor
// @route DELETE /api/machines/:machineId/monitorings/:monitoringId/sensors/:sensorId
// @access Private
const deleteSensor = asyncHandler(async (req, res) => {

  const sensor = await Sensor.findById(req.params.sensorId);

  if (sensor) {
    await Sensor.deleteOne({ _id: req.params.sensorId }); // Usando deleteOne para excluir
    res.json({ message: 'Sensor removed' });
  } else {
    res.status(404);
    throw new Error('Sensor not found');
  }
});

// Função para obter um sensor pelo ID
const getSensorById = asyncHandler(async (req, res) => {
  const sensor = await Sensor.findById(req.params.sensorId);

  if (sensor) {
    res.json(sensor);
  } else {
    res.status(404);
    throw new Error('Sensor not found');
  }
});

// Função para atualizar um sensor
const updateSensor = asyncHandler(async (req, res) => {
  const { name, status } = req.body; // Usando 'name' e 'status' como os únicos campos editáveis

  const sensor = await Sensor.findById(req.params.sensorId);

  if (sensor) {
    sensor.name = name || sensor.name;
    sensor.status = status || sensor.status;

    const updatedSensor = await sensor.save();
    res.json(updatedSensor);
  } else {
    res.status(404);
    throw new Error('Sensor not found');
  }
});



export { getSensorsForMonitoring, addSensor, deleteSensor, getSensorById, updateSensor };
