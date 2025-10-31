const { Transaction } = require('sequelize');
const db = require('../../config/db');
const experiencesRepo = require('../repositories/experiences.repo');
const bookingsRepo = require('../repositories/bookings.repo');
const promoRepo = require('../repositories/promo.repo');

function startEndOfDay(dateLike) {
  const d1 = new Date(dateLike);
  d1.setHours(0,0,0,0);
  const d2 = new Date(dateLike);
  d2.setHours(23,59,59,999);
  return [d1, d2];
}

function calculateEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
  return `${endHours}:${endMinutes}`;
}

async function validateAndApplyPromo(code, amount) {
  if (!code) return { valid: true, discountAmount: 0, finalPrice: amount };
  const promo = await promoRepo.findActiveByCode(code);
  if (!promo) return { valid: false, message: 'Invalid or expired promo code' };
  if (promo.minOrderAmount && amount < promo.minOrderAmount) {
    return { valid: false, message: `Minimum order amount of ${promo.minOrderAmount} required` };
  }
  let discountAmount = 0;
  if (promo.discountType === 'percentage') {
    discountAmount = (amount * promo.discountValue) / 100;
    if (promo.maxDiscount) discountAmount = Math.min(discountAmount, promo.maxDiscount);
  } else {
    discountAmount = Math.min(promo.discountValue, amount);
  }
  return { valid: true, discountAmount, finalPrice: amount - discountAmount };
}

async function createBooking(payload) {
  const {
    experienceId,
    customerName,
    customerEmail,
    bookingDate,
    startTime,
    endTime,
    numberOfPeople,
    promoCode,
    specialRequests,
  } = payload;

  const experience = await experiencesRepo.findById(experienceId);
  if (!experience) throw new Error('Experience not found');
  if (!experience.isActive) throw new Error('This experience is currently not available');

  let totalPrice = Number(experience.price) * Number(numberOfPeople || 1);
  const promoResult = await validateAndApplyPromo(promoCode, totalPrice);
  if (!promoResult.valid) throw new Error(promoResult.message);

  const created = await db.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
    async (t) => {
      const [startOfDay, endOfDay] = startEndOfDay(bookingDate);
      const existing = await bookingsRepo.findAllForDayAndSlot(
        experienceId,
        startOfDay,
        endOfDay,
        startTime,
        t,
        t.LOCK.UPDATE,
      );
      const totalBooked = existing.reduce((sum, b) => sum + b.numberOfPeople, 0);
      if (totalBooked + Number(numberOfPeople) > experience.capacity) {
        throw new Error('The selected time slot is not available');
      }

      return bookingsRepo.create({
        experienceId,
        customerName,
        customerEmail,
        bookingDate: new Date(bookingDate),
        startTime,
        endTime: endTime || calculateEndTime(startTime, experience.duration),
        numberOfPeople,
        totalPrice: promoResult.finalPrice,
        promoCode: promoCode || null,
        discountAmount: promoResult.discountAmount,
        specialRequests,
        status: 'confirmed',
        paymentStatus: 'pending',
      }, t);
    }
  );

  return {
    bookingId: created.id,
    totalPrice: promoResult.finalPrice,
    discountAmount: promoResult.discountAmount,
  };
}

module.exports = {
  createBooking,
};
