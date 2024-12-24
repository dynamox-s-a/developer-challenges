const sensorService = require('../service/sensorService');

exports.postAddSensor = async (req, res) => {
  const { type, point_id } = req.body;
  try {
    const sensor = await sensorService.postAddSensor(type, point_id);
    res.status(200).send({
      message: 'Sensor cadastrado com sucesso!',
      sensor: {
        id: sensor.id,
        name: sensor.name
      }
    });
  } catch (error) {
    res.status(500).send({ error: 'Erro ao cadastrar Sensor.' });
  }
};

exports.deleteSensorById = (req, res) => {

  sensorService.deletePointById(req.params.idSensor)
    .then(() => {
      res.status(200).send({ message: 'Sensor deletado com sucesso!' });
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
};