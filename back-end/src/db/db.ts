import { Sequelize } from "sequelize"; // importar o sequelize
import dotenv from "dotenv/config.js"; // importar o dotenv para localizar as variáveis de ambiente

const dbName = 'postgres' as string; // passar os dados do .env para as constantes
const dbUser = 'postgres' as string;
const dbHost = 'localhost' as string;
const dbPassword = 'postgres' as string;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  //passar os dados para o sequelize
  dialect: "postgres", //informar o tipo de banco que vamos utilizar
  host: dbHost, //o host, neste caso estamos com um banco local
});

export default sequelize; //exportar
