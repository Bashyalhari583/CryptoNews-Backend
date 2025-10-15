// db.js
import mysql from "mysql2/promise";
import config from "./config.js"; // Make sure the path is correct
import dotenv from "dotenv";

dotenv.config();

// Choose environment: development, test, or production
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

// Create a MySQL connection pool
const db = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
