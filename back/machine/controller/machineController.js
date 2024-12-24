const machineService = require('../service/machineService');

exports.getAllMachines = (_, res) => {
  machineService.getAllMachines()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
};

exports.getMachineById = (req, res) => {
  const idMachine = req.params.idMachine;

  if (!idMachine) {
    return res.status(400).send({ error: 'idMachine é necessário' });
  }

  machineService.getMachineById(idMachine)
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).send({ message: 'Máquina não encontrada' });
      }
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(500).send({ error: 'Erro ao buscar a máquina' });
    });
};

exports.postAddNewMachine = async (req, res) => {
  const { name, type } = req.body;
  try {
    const machine = await machineService.postAddNewMachine(name, type);
    res.status(200).send({
      message: 'Máquina cadastrada com sucesso!',
      machine: {
        id: machine.id,
        name: machine.name,
        type: machine.type
      }
    });
  } catch (error) {
    res.status(500).send({ error: 'Erro ao cadastrar a máquina.' });
  }
};

exports.putEditMachineById = async (req, res) => {
  const { name, type  } = req.body
  const { idMachine } = req.params

  try {
    const response = await machineService.putEditMachineById(name, type, idMachine);
    const machine = response[0]
    res.status(200).send({
      message: 'Máquina alterada com sucesso!',
      machine: {
        id: machine.id,
        name: machine.name,
        type: machine.type
      }
    });
  } catch (error) {
    res.status(500).send({ error: 'Erro ao alterar a máquina.' });
  }
};

exports.deleteMachineById = (req, res) => {
  const idMachine = req.params.idMachine;

  machineService.deleteMachineById(idMachine)
    .then(() => {
      res.status(200).send({ message: 'Máquina deletada com sucesso!' });
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
};