import {Sequelize} from "sequelize-typescript";

// Содержимое переменных окружения хранится в виде строк
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;
const somethingIsNotDefined = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT].some((it) => it === undefined);

if (somethingIsNotDefined) {
  throw new Error(`One or more environmental variables are not defined`);
}

export default new Sequelize (
  DB_NAME as string, DB_USER as string, DB_PASSWORD, {
    host: DB_HOST,
    port: Number(DB_PORT as string),
    dialect: `postgres`,
    pool: {
      max: 5, // Maximum number of connection in pool
      min: 0,
      acquire: 10000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released.
    }
  }
);
