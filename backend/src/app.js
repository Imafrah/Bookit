require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('./models');

const experienceRoutes = require('./routes/experienceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const promoRoutes = require('./routes/promoRoutes');
const errorHandler = require('./middleware/error');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database connection (lazy auth; on serverless, connection may be established per invocation)
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Unable to connect to the database:', err));

app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promo', promoRoutes);

app.get('/', (req, res) => {
  res.json({ status: "ok" });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is healthy" });
});



// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
