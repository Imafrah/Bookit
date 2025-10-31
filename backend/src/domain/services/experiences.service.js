const { Op } = require('sequelize');
const Experience = require('../../models/Experience');
const Booking = require('../../models/Booking');

function startEndOfDay(dateLike) {
  const d1 = new Date(dateLike);
  d1.setHours(0,0,0,0);
  const d2 = new Date(dateLike);
  d2.setHours(23,59,59,999);
  return [d1, d2];
}

const DEFAULT_SLOTS = ['09:00', '11:00', '14:00', '16:00'];

async function getAllActive() {
  return Experience.findAll({ where: { isActive: true }, order: [['createdAt', 'DESC']] });
}

async function getByIdWithAvailability(id, dateStr) {
  const experience = await Experience.findByPk(id);
  if (!experience) return null;
  const date = dateStr || new Date().toISOString().split('T')[0];
  const [startOfDay, endOfDay] = startEndOfDay(date);

  const bookings = await Booking.findAll({
    where: {
      experienceId: id,
      bookingDate: { [Op.gte]: startOfDay, [Op.lte]: endOfDay },
      status: { [Op.notIn]: ['cancelled'] },
    },
  });

  const availableSlots = DEFAULT_SLOTS.map(time => ({ time, available: experience.capacity }));
  bookings.forEach(b => {
    const slot = availableSlots.find(s => s.time === b.startTime);
    if (slot) {
      slot.available -= b.numberOfPeople;
      if (slot.available < 0) slot.available = 0;
    }
  });

  return {
    experience,
    availability: { date, availableSlots },
  };
}

async function getAvailability(id, dateStr) {
  const experience = await Experience.findByPk(id);
  if (!experience) return null;
  const [startOfDay, endOfDay] = startEndOfDay(dateStr);
  const bookings = await Booking.findAll({
    where: {
      experienceId: id,
      bookingDate: { [Op.gte]: startOfDay, [Op.lte]: endOfDay },
      status: { [Op.notIn]: ['cancelled'] },
    },
  });

  const availableSlots = DEFAULT_SLOTS.map(time => ({ time, available: experience.capacity }));
  bookings.forEach(b => {
    const slot = availableSlots.find(s => s.time === b.startTime);
    if (slot) {
      slot.available -= b.numberOfPeople;
      if (slot.available < 0) slot.available = 0;
    }
  });

  return {
    experience: { id: experience.id, title: experience.title, capacity: experience.capacity },
    date: dateStr,
    availableSlots,
  };
}

module.exports = {
  getAllActive,
  getByIdWithAvailability,
  getAvailability,
};
