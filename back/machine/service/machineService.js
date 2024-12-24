const database = require('../../database');
const machineQueries = require('./sql/machineQueries');

exports.getAllMachines = () => {
  return database.query(machineQueries.getAllMachinesQuery)
    .then((result) => result.rows)
    .catch((error) => {
      throw error;
    })
}

exports.getMachineById = (idMachine) => {
  const values = [idMachine];
  return database.query(machineQueries.getMachineByIdQuery, values)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      console.error('Erro ao consultar a máquina:', error);
      throw error;
    });
};


exports.postAddNewMachine = async (name, type) => {
  const sqlFinal = `
    INSERT INTO machines.machine(name, type)
    VALUES ($1, $2)
    RETURNING id, name, type;
  `;
  
  const values = [name, type];
  
  try {
    const result = await database.query(sqlFinal, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.putEditMachineById = async (name, type, idMachine) => {
  const sqlFinal = `UPDATE machines.machine SET name = '${name}', type = '${type}' WHERE id = ${idMachine} RETURNING id, name, type;`
  return await database.query(sqlFinal)
  .then((result) => result.rows)
  .catch((error) => {
      throw error;
    });
};

exports.deleteMachineById = async (idProduto) => {
  const values = [idProduto];
  return await database.query(machineQueries.deleteMachineByIdQuery, values)
    .then((result) => result.rows)
    .catch((error) => {
      throw error;
    });
};