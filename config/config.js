// require('dotenv').config(); // Load environment variables from .env file
// module.exports =
// {
//   "development": {
//     "username": "root",
//     "password": null,
//     "database": "cryptonews",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//   "username": process.env.DB_USER,
//   "password": process.env.DB_PASSWORD,
//   "database": process.env.DB_NAME,
//   "host": process.env.DB_HOST,
//   "dialect": "mysql",
//   "port": process.env.DB_PORT
// }
// }

import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const config = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "cryptonews",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "database_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
  },
};

export default config;
