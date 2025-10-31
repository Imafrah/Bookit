const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
};

async function testConnection() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });

    console.log('Successfully connected to the MySQL database!');

    const [rows] = await connection.execute('SELECT NOW() AS now');
    console.log('Current time from database:', rows[0].now);
  } catch (err) {
    console.error('Error connecting to the MySQL database:', err);
  } finally {
    if (connection) await connection.end();
  }
}

testConnection();
