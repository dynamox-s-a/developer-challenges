const pointService = require('../service/pointService');

exports.getAllPoints = (_, res) => {
  pointService.getAllPoint()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
};

exports.getPointById = (req, res) => {
  const idPoint = req.params.idPoint;

  if (!idPoint) {
    return res.status(400).send({ error: 'idPoint é necessário' });
  }

  pointService.getPointById(idPoint)
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).send({ message: 'Ponto não encontrado' });
      }
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(500).send({ error: 'Erro ao buscar o ponto' });
    });
};

exports.postAddNewPoint = async (req, res) => {
  const { name, machine_id } = req.body;
  try {
    const point = await pointService.postAddNewPoint(name, machine_id);
    res.status(200).send({
      message: 'Ponto de Monitoramento cadastrado com sucesso!',
      point: {
        id: point.id,
        name: point.name
      }
    });
  } catch (error) {
    res.status(500).send({ error: 'Erro ao cadastrar Ponto de Monitoramento.' });
  }
};

exports.putEditPointById = (req, res) => {
  const { name  } = req.body
  const { idPoint } = req.params

  pointService.putEditPointById(name, idPoint)
    .then(() => {
      res.status(200).send({ message: 'Ponto de Monitoramento alterado com sucesso!' });
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
};


exports.putEditPointById = async (req, res) => {
  const { name  } = req.body
  const { idPoint } = req.params

  try {
    const response = await pointService.putEditPointById(name, idPoint);
    const point = response[0]
    res.status(200).send({
      message: 'Ponto alterado com sucesso!',
      point: {
        id: point.id,
        name: point.name
      }
    });
  } catch (error) {
    res.status(500).send({ error: 'Erro ao alterar o ponto.' });
  }
};

exports.deletePointById = (req, res) => {

  pointService.deletePointById(req.params.idPoint)
    .then(() => {
      res.status(200).send({ message: 'Ponto de Monitoramento deletado com sucesso!' });
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
};