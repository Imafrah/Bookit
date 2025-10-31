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

// Database connection and optional sync
async function start() {
  try {
    await db.authenticate();
    console.log('Database connected...');
    if (String(process.env.SYNC_DB || '').toLowerCase() === 'true') {
      await db.sync();
      console.log('Database synced (SYNC_DB=true)');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

// Routes
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promo', promoRoutes);

// Basic route
app.get('/api', (req, res) => {
  res.send('BookIt API is running...');
});

start();

module.exports = app;
