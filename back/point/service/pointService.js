const database = require('../../database');
const pointQueries = require('./sql/pointQueries');

exports.getAllPoint = () => {
  return database.query(pointQueries.getAllPointsQuery)
    .then((result) => result.rows)
    .catch((error) => {
      throw error;
    })
}

exports.getPointById = (idPoint) => {
  const values = [idPoint];
  return database.query(pointQueries.getPointByIdQuery, values)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      console.error('Erro ao consultar a ponto:', error);
      throw error;
    });
};

exports.postAddNewPoint = async (name, machine_id) => {
  const sqlFinal = `
    INSERT INTO points.point(name, machine_id)
    VALUES ($1, $2)
    RETURNING id, name, machine_id;
  `;
  
  const values = [name, machine_id];
  
  try {
    const result = await database.query(sqlFinal, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.putEditPointById = async (name, idPoint) => {
  const sqlFinal = `UPDATE points.point SET name = '${name}' WHERE id = ${idPoint} RETURNING id, name;`
  return await database.query(sqlFinal)
  .then((result) => result.rows)
  .catch((error) => {
      throw error;
    });
};

exports.deletePointById = async (idProduto) => {
  const values = [idProduto];
  return await database.query(pointQueries.deletePointByIdQuery, values)
    .then((result) => result.rows)
    .catch((error) => {
      throw error;
    });
};