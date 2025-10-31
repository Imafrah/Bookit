const path = require('path');
const dotenv = require('dotenv');

// Always load env from backend/.env to work when launched from repo root
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env'), override: true });

function required(name, value) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  db: {
    host: required('DB_HOST', process.env.DB_HOST || '127.0.0.1'),
    port: Number(process.env.DB_PORT || 3306),
    name: required('DB_NAME', process.env.DB_NAME),
    user: required('DB_USER', process.env.DB_USER),
    password: process.env.DB_PASSWORD ?? '',
    logging: false,
  },
};

module.exports = config;
