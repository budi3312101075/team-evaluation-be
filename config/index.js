import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const evaluationDB = mysql.createPool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.TEAM_DB,
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 30,
});

export const mentorsDB = mysql.createPool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.MENTORS_DB,
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 30,
});

export const managementDB = mysql.createPool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.MANAGEMENT_DB,
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 30,
});
