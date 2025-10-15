// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.js')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// // db.Event = require('./event')(sequelize, Sequelize);
// // db.News = require('./news')(sequelize, Sequelize);
// module.exports = db;

import Event from "./event.js";
import News from "./news.js";
import Sequelize from "sequelize";
import dotenv from "dotenv";
import configFile from "../config/config.js";

dotenv.config();

const env = process.env.NODE_ENV || "development";
const config = configFile[env];

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

const db = {};

// Initialize models
db.Event = Event.initModel(sequelize);
db.News = News.initModel(sequelize);

// Setup associations if any
Object.values(db).forEach((model) => {
  if (model.associate) model.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

try {
  await db.sequelize.authenticate();
  console.log("Sequelize DB connected!");
} catch (err) {
  console.error("Sequelize connection error:", err);
}

export default db;
