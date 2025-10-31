const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const validate = require('../middleware/validate');
const { bookingCreateSchema } = require('../schemas/bookings.schema');

// @route   GET /api/bookings
// @desc    Get all bookings (with optional filters)
// @access  Admin
router.get('/', bookingController.getBookings);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Public (consider adding authentication)
router.get('/:id', bookingController.getBookingById);

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public (consider adding authentication)
router.post('/', validate({ body: bookingCreateSchema }), bookingController.createBooking);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Public (consider adding authentication)
router.put('/:id/cancel', bookingController.cancelBooking);

// @route   GET /api/bookings/experience/:experienceId/availability
// @desc    Check availability for a specific experience
// @access  Public
router.get('/experience/:experienceId/availability', bookingController.checkAvailability);

module.exports = router;
