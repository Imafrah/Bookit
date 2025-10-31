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
    const syncForce = String(process.env.DB_SYNC_FORCE || '').toLowerCase() === 'true';
    const syncAlter = !syncForce && String(process.env.DB_SYNC_ALTER || '').toLowerCase() === 'true';
    const syncSimple = !syncForce && !syncAlter && String(process.env.SYNC_DB || '').toLowerCase() === 'true';

    if (syncForce) {
      await db.sync({ force: true });
      console.log('Database synced with FORCE (DB_SYNC_FORCE=true)');
    } else if (syncAlter) {
      await db.sync({ alter: true });
      console.log('Database synced with ALTER (DB_SYNC_ALTER=true)');
    } else if (syncSimple) {
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

// Health route for platform checks
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

start();

module.exports = app;
