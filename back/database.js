const pg = require('pg');
const database = new pg.Client(process.env.DATABASE_URL);

database.connect((error) => {
  if (error) {
    return console.log('Não foi possível se conectar ao PostgreSQL local:', error);
  } else {
    return console.log('Conectado ao PostgreSQL local com sucesso!');
  }
});

module.exports = database;
