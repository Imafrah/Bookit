const db = require('../config/db');
const Experience = require('./Experience');
const Booking = require('./Booking');
const PromoCode = require('./PromoCode');

Experience.hasMany(Booking, { foreignKey: 'experienceId' });
Booking.belongsTo(Experience, { foreignKey: 'experienceId' });

module.exports = {
  db,
  Experience,
  Booking,
  PromoCode,
};
