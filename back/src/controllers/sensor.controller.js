const { sensorService } = require('../services');
const mapStatusHTTP = require('../utils/mapStatus.util.js');

const registerSensor = async (req, res) => {
  const { status, data } = await sensorService.registerSensor(req.body);
  return res.status(mapStatusHTTP(status)).json(data);
};

module.exports = {
  registerSensor,
};