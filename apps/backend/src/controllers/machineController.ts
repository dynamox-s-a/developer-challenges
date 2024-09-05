import asyncHandler from 'express-async-handler';
import Machine from '../models/machineModel';
import Monitoring from '../models/monitoringModel';
import Sensor from '../models/sensorModel';

// @desc Get all machines
// @route GET /api/machines
// @access Private
const getMachines = asyncHandler(async (req, res) => {
  const machines = await Machine.find({});
  res.json(machines);
});

// @desc Create a machine
// @route POST /api/machines
// @access Private
const createMachine = asyncHandler(async (req, res) => {
  const { name, type, status } = req.body;

  // Validação do tipo
  const validTypes = ["Bomba", "Ventilador"];
  if (!validTypes.includes(type)) {
    res.status(400);
    throw new Error('Tipo de máquina inválido. Selecione entre "Bomba" ou "Ventilador".');
  }

  const machine = new Machine({ name, type, status });

  const createdMachine = await machine.save();
  res.status(201).json(createdMachine);
});

// @desc Delete a machine and all its monitorings and sensors
// @route DELETE /api/machines/:id
// @access Private
const deleteMachine = asyncHandler(async (req, res) => {
  const machine = await Machine.findById(req.params.id);

  if (!machine) {
    res.status(404);
    throw new Error('Machine not found');
  }

  // Encontre todos os monitoramentos relacionados à máquina
  const monitorings = await Monitoring.find({ machine: req.params.id });

  for (const monitoring of monitorings) {
    // Exclua todos os sensores relacionados a cada monitoramento
    await Sensor.deleteMany({ monitoring: monitoring._id });
    // Exclua o monitoramento
    await Monitoring.deleteOne({ _id: monitoring._id });
  }

  // Por fim, exclua a máquina
  await Machine.deleteOne({ _id: req.params.id });

  res.json({ message: 'Machine and all related data removed' });
});

// @desc Get a machine by ID
// @route GET /api/machines/:id
// @access Private
const getMachineById = asyncHandler(async (req, res) => {
  const machine = await Machine.findById(req.params.id);

  if (machine) {
    res.json(machine);
  } else {
    res.status(404);
    throw new Error('Machine not found');
  }
});

// @desc Update a machine
// @route PUT /api/machines/:id
// @access Private
const updateMachine = asyncHandler(async (req, res) => {
  const { name, type, status } = req.body;

  const machine = await Machine.findById(req.params.id);

  if (machine) {
    // Validação do tipo
    const validTypes = ["Bomba", "Ventilador"];
    if (!validTypes.includes(type)) {
      res.status(400);
      throw new Error('Tipo de máquina inválido. Selecione entre "Bomba" ou "Ventilador".');
    }

    machine.name = name;
    machine.type = type;
    machine.status = status;

    const updatedMachine = await machine.save();
    res.json(updatedMachine);
  } else {
    res.status(404);
    throw new Error('Machine not found');
  }
});

export { getMachines, createMachine, deleteMachine, getMachineById, updateMachine };
