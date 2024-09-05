import asyncHandler from "express-async-handler";
import Machine from '../models/machineModel';
import Monitoring from "../models/monitoringModel";
import Sensor from "../models/sensorModel";
import axios from 'axios';


// @desc Get all monitorings for a specific machine
// @route GET /api/monitorings/:machineId
// @access Private
const getMonitoringsForMachine = asyncHandler(async (req, res) => {
  const machineId = req.params.id; // Use 'id' se for assim que está na rota
  const monitorings = await Monitoring.find({ machine: machineId });

  if (monitorings.length > 0) {
    res.json(monitorings);
  } else {
    res.status(404);
    throw new Error("No monitorings found for this machine");
  }
});


// @desc Add a monitoring
// @route POST /api/machines/:machineId/monitorings
// @access Private
const addMonitoring = asyncHandler(async (req, res) => {
  try {
    const { name, type } = req.body; // Usando 'type' em vez de 'sensorModel'
    const machineId = req.params.id;

    const machine = await Machine.findById(machineId).lean();

    if (!machine) {
      res.status(404);
      throw new Error("Machine not found");
    }

    console.log("Tipo da Máquina:", machine.type);

    // Verifica se o modelo de sensor é permitido para o tipo de máquina
    if (machine.type === "Bomba" && (type === "TcAg" || type === "TcAs")) {
      res.status(400);
      throw new Error("Sensores 'TcAg' e 'TcAs' não podem ser associados a máquinas do tipo 'Bomba'");
    }

    const monitoring = new Monitoring({
      name,
      type, // Salva o tipo de sensor como 'type'
      machine: machineId,
    });

    const createdMonitoring = await monitoring.save();
    res.status(201).json(createdMonitoring);
  } catch (error: unknown) {
    const typedError = error as any;
    if (axios.isAxiosError(typedError)) {
      console.error("Erro ao criar monitoramento:", typedError.response?.data || typedError.message);
    } else {
      console.error("Erro desconhecido:", typedError);
      res.status(500).json({ message: "Erro ao criar monitoramento" });
    }
  }
});


// @desc Delete a monitoring and its associated sensors
// @route DELETE /api/machines/:machineId/monitorings/:monitoringId
// @access Private
const deleteMonitoring = asyncHandler(async (req, res) => {
  const monitoringId = req.params.monitoringId;

  // Exclui todos os sensores associados ao monitoramento
  await Sensor.deleteMany({ monitoring: monitoringId });

  // Exclui o próprio monitoramento
  const monitoring = await Monitoring.findById(monitoringId);
  if (monitoring) {
    await Monitoring.deleteOne({ _id: monitoringId }); // Usando deleteOne para excluir
    res.json({ message: "Monitoring and its sensors removed" });
  } else {
    res.status(404);
    throw new Error("Monitoring not found");
  }
});

// Função para buscar o monitoramento por ID
const getMonitoringById = asyncHandler(async (req, res) => {
  const monitoring = await Monitoring.findById(req.params.monitoringId);

  if (monitoring) {
    res.json(monitoring);
  } else {
    res.status(404);
    throw new Error('Monitoring not found');
  }
});

// @desc Update a monitoring
// @route PUT /api/machines/:machineId/monitorings/:monitoringId
// @access Private
const updateMonitoring = asyncHandler(async (req, res) => {
  const { name, type } = req.body;
  const monitoringId = req.params.monitoringId;

  const monitoring = await Monitoring.findById(monitoringId);

  if (monitoring) {
    monitoring.name = name || monitoring.name;
    monitoring.type = type || monitoring.type;

    const updatedMonitoring = await monitoring.save();
    res.json(updatedMonitoring);
  } else {
    res.status(404);
    throw new Error("Monitoring not found");
  }
});

export { getMonitoringsForMachine, addMonitoring, deleteMonitoring, getMonitoringById, updateMonitoring };
