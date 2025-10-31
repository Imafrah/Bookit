const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env only if running locally and file exists
const envPath = path.resolve(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.log("✅ Using Render Environment Variables");
}

function required(name, value) {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  db: {
    host: required('DB_HOST', process.env.DB_HOST),
    port: Number(process.env.DB_PORT || 3306),
    name: required('DB_NAME', process.env.DB_NAME),
    user: required('DB_USER', process.env.DB_USER),
    password: process.env.DB_PASSWORD ?? '',
    logging: false,
  },
};

module.exports = config;
