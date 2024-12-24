const database = require('../../database');
const sensorQueries = require('./sql/sensorQueries');

exports.postAddSensor = async (type, point_id) => {
  const values = [type, point_id];
  
  try {
    const result = await database.query(sensorQueries.postAddSensor, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deletePointById = async (pointId) => {
  const values = [pointId];
  return await database.query(sensorQueries.deletePointByIdQuery, values)
    .then((result) => result.rows)
    .catch((error) => {
      throw error;
    });
};