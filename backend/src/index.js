require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
// Initialize models and associations
require('./models');

// Import routes
const experienceRoutes = require('./routes/experienceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const promoRoutes = require('./routes/promoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());

// Database connection
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Routes
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promo', promoRoutes);

// Basic route
app.get('/api', (req, res) => {
  res.send('BookIt API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
