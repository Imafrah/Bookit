const { Op } = require('sequelize');
const Booking = require('../../models/Booking');

async function findAllForDay(experienceId, dayStart, dayEnd, t) {
  return Booking.findAll({
    where: {
      experienceId,
      bookingDate: { [Op.gte]: dayStart, [Op.lte]: dayEnd },
      status: { [Op.notIn]: ['cancelled'] },
    },
    transaction: t,
  });
}

async function findAllForDayAndSlot(experienceId, dayStart, dayEnd, startTime, t, lock) {
  return Booking.findAll({
    where: {
      experienceId,
      bookingDate: { [Op.gte]: dayStart, [Op.lte]: dayEnd },
      startTime,
      status: { [Op.notIn]: ['cancelled'] },
    },
    transaction: t,
    lock,
  });
}

async function create(data, t) {
  return Booking.create(data, { transaction: t });
}

module.exports = {
  findAllForDay,
  findAllForDayAndSlot,
  create,
};
