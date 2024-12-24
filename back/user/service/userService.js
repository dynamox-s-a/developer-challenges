const database = require('../../database');
const userQueries = require('./sql/userQueries');

exports.postAddNewUser = async (email, password) => {
  const values = [email, password]
  return await database.query(userQueries.postAddNewUserQuery, values)
    .then((result) => {
      return result.rows
    })
    .catch((error) => {
      throw error;
  });
};

exports.putEditUserById = async (email, password, idUsuario) => {
  const sqlFinal = `UPDATE usuarios.usuario SET email = '${email}', password = '${password}' WHERE id = ${idUsuario};`
  return await database.query(sqlFinal)
    .then((result) => result.rows)
    .catch((error) => {
      throw error;
    });
};