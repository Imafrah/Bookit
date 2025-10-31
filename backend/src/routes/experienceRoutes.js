const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const experienceController = require('../controllers/experienceController');

// @route   GET /api/experiences
// @desc    Get all experiences
// @access  Public
router.get('/', experienceController.getExperiences);

// @route   GET /api/experiences/:id
// @desc    Get single experience by ID
// @access  Public
router.get('/:id', experienceController.getExperienceById);

// @route   GET /api/experiences/:id/availability
// @desc    Get available slots for an experience
// @access  Public
router.get('/:id/availability', experienceController.getExperienceAvailability);

// @route   POST /api/experiences
// @desc    Create a new experience
// @access  Admin
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('price', 'Please include a valid price').isNumeric(),
    check('duration', 'Duration is required').isNumeric(),
    check('capacity', 'Capacity is required').isNumeric(),
  ],
  experienceController.createExperience
);

// @route   PUT /api/experiences/:id
// @desc    Update an experience
// @access  Admin
router.put('/:id', experienceController.updateExperience);

// @route   DELETE /api/experiences/:id
// @desc    Delete an experience
// @access  Admin
router.delete('/:id', experienceController.deleteExperience);

module.exports = router;
