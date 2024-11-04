const { assetService } = require('../services');
const mapStatusHTTP = require('../utils/mapStatus.util.js');

const registerAsset = async (req, res) => {
  const { status, data } = await assetService.registerAsset(req.body);
  return res.status(mapStatusHTTP(status)).json(data);
};

const showAssets = async (req, res) => {
  const { status, data } = await assetService.showAssets();
  return res.status(mapStatusHTTP(status)).json(data);
}

module.exports = {
  registerAsset,
  showAssets
};