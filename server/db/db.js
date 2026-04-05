require("dotenv/config");
const mysql = require("mysql2/promise");
const { drizzle } = require("drizzle-orm/mysql2");

const pool = mysql.createPool({
 host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,   // adjustable
  queueLimit: 0
});

const db = drizzle(pool);

module.exports = db;