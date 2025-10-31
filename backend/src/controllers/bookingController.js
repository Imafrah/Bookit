const { validationResult } = require('express-validator');
const { Op, Transaction } = require('sequelize');
const Booking = require('../models/Booking');
const Experience = require('../models/Experience');
const PromoCode = require('../models/PromoCode');
const db = require('../config/db');
const bookingService = require('../domain/services/bookings.service');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Admin
exports.getBookings = async (req, res) => {
  try {
    const { status, startDate, endDate, experienceId } = req.query;
    
    const whereClause = {};
    
    if (status) whereClause.status = status;
    if (experienceId) whereClause.experienceId = experienceId;
    
    if (startDate && endDate) {
      whereClause.bookingDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.bookingDate = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereClause.bookingDate = { [Op.lte]: new Date(endDate) };
    }
    
    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        {
          model: Experience,
          attributes: ['id', 'title', 'price', 'duration']
        }
      ],
      order: [['bookingDate', 'DESC']],
    });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Public
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: Experience,
          attributes: ['id', 'title', 'price', 'duration', 'location']
        }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
  } = req.body;

  try {
    const result = await bookingService.createBooking({
      experienceId,
      customerName,
      customerEmail,
      bookingDate,
      startTime,
      endTime,
      numberOfPeople,
      promoCode,
      specialRequests,
    });

    res.status(201).json({
      msg: 'Booking created successfully',
      bookingId: result.bookingId,
      totalPrice: result.totalPrice,
      discountAmount: result.discountAmount,
      finalPrice: result.totalPrice - result.discountAmount,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({ msg: err.message || 'Unable to create booking' });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Public
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ msg: 'Booking is already cancelled' });
    }

    // In a real app, you might want to implement a cancellation policy
    // For example, no cancellations within 24 hours of the booking time
    const bookingTime = new Date(`${booking.bookingDate.toISOString().split('T')[0]}T${booking.startTime}`);
    const now = new Date();
    const hoursUntilBooking = (bookingTime - now) / (1000 * 60 * 60);
    
    if (hoursUntilBooking < 24) {
      return res.status(400).json({ 
        msg: 'Bookings can only be cancelled at least 24 hours in advance' 
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // In a real app, you might want to issue a refund here
    // and update the payment status accordingly

    res.json({ msg: 'Booking cancelled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Check availability for a specific experience
// @route   GET /api/bookings/experience/:experienceId/availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const { date, startTime, numberOfPeople = 1 } = req.query;

    if (!date) {
      return res.status(400).json({ msg: 'Date is required' });
    }

    const experience = await Experience.findByPk(experienceId);
    if (!experience) {
      return res.status(404).json({ msg: 'Experience not found' });
    }

    // If startTime is provided, check specific slot
    if (startTime) {
      const isAvailable = await checkAvailability(
        experienceId,
        date,
        startTime,
        parseInt(numberOfPeople)
      );
      
      return res.json({
        available: isAvailable,
        experience: {
          id: experience.id,
          title: experience.title,
          capacity: experience.capacity,
          price: experience.price,
        },
        date,
        startTime,
        numberOfPeople: parseInt(numberOfPeople),
      });
    }

    // If no specific time, return all available slots for the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.findAll({
      where: {
        experienceId,
        bookingDate: {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay,
        },
        status: {
          [Op.notIn]: ['cancelled'],
        },
      },
    });

    // Define available time slots (simplified example)
    const timeSlots = [
      { time: '09:00', available: experience.capacity },
      { time: '11:00', available: experience.capacity },
      { time: '14:00', available: experience.capacity },
      { time: '16:00', available: experience.capacity },
    ];

    // Update available slots based on existing bookings
    bookings.forEach(booking => {
      const slot = timeSlots.find(s => s.time === booking.startTime);
      if (slot) {
        slot.available -= booking.numberOfPeople;
        if (slot.available < 0) slot.available = 0;
      }
    });

    res.json({
      experience: {
        id: experience.id,
        title: experience.title,
        capacity: experience.capacity,
        price: experience.price,
      },
      date,
      timeSlots,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Helper function to check availability for a specific time slot
async function checkAvailability(experienceId, bookingDate, startTime, numberOfPeople) {
  const experience = await Experience.findByPk(experienceId);
  if (!experience) return false;

  const startOfDay = new Date(bookingDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(bookingDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Get all bookings for the same time slot
  const bookings = await Booking.findAll({
    where: {
      experienceId,
      bookingDate: {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay,
      },
      startTime,
      status: {
        [Op.notIn]: ['cancelled'],
      },
    },
  });

  // Calculate total people already booked for this time slot
  const totalBooked = bookings.reduce((sum, booking) => sum + booking.numberOfPeople, 0);
  
  // Check if there's enough capacity
  return (totalBooked + numberOfPeople) <= experience.capacity;
}

// Helper function to validate and apply promo code
async function validateAndApplyPromoCode(code, amount) {
  const promoCode = await PromoCode.findOne({
    where: {
      code: code.toUpperCase(),
      isActive: true,
      startDate: { [Op.lte]: new Date() },
      [Op.or]: [
        { endDate: null },
        { endDate: { [Op.gte]: new Date() } }
      ],
      [Op.or]: [
        { maxUses: null },
        { useCount: { [Op.lt]: { [Op.col]: 'maxUses' } } }
      ]
    }
  });

  if (!promoCode) {
    return { valid: false, message: 'Invalid or expired promo code' };
  }

  // Check minimum order amount if specified
  if (promoCode.minOrderAmount && amount < promoCode.minOrderAmount) {
    return { 
      valid: false, 
      message: `Minimum order amount of ${promoCode.minOrderAmount} required` 
    };
  }

  // Calculate discount
  let discountAmount = 0;
  if (promoCode.discountType === 'percentage') {
    discountAmount = (amount * promoCode.discountValue) / 100;
    
    // Apply maximum discount if specified
    if (promoCode.maxDiscount) {
      discountAmount = Math.min(discountAmount, promoCode.maxDiscount);
    }
  } else {
    // Fixed amount discount
    discountAmount = Math.min(promoCode.discountValue, amount);
  }

  const finalPrice = amount - discountAmount;

  return {
    valid: true,
    discountAmount,
    finalPrice,
    promoCodeId: promoCode.id
  };
}

// Helper function to calculate end time based on start time and duration in minutes
function calculateEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  
  // Format as HH:MM
  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
  
  return `${endHours}:${endMinutes}`;
}
