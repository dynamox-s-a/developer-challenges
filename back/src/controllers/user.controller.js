const { userService } = require('../services');
const mapStatusHTTP = require('../utils/mapStatus.util.js');

const createUser = async (req, res) => {
  const { status, data } = await userService.createUser(req.body)
  return res.status(mapStatusHTTP(status)).json(data);
};

const login = async (req, res) => {
  const { status, data } = await userService.login(req.body)
  return res.status(mapStatusHTTP(status)).json(data);
};

module.exports = {
  createUser,
  login,
};
