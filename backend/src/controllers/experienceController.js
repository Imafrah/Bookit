const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Experience = require('../models/Experience');
const Booking = require('../models/Booking');
const experiencesService = require('../domain/services/experiences.service');

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
exports.getExperiences = async (req, res) => {
  try {
    const experiences = await experiencesService.getAllActive();
    res.json(experiences);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
exports.getExperienceById = async (req, res) => {
  try {
    const result = await experiencesService.getByIdWithAvailability(req.params.id, req.query.date);
    if (!result) {
      return res.status(404).json({ msg: 'Experience not found' });
    }
    res.json({
      ...result.experience.toJSON(),
      availability: result.availability,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Experience not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get available slots for an experience
// @route   GET /api/experiences/:id/availability
// @access  Public
exports.getExperienceAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    const result = await experiencesService.getAvailability(req.params.id, date);
    if (!result) {
      return res.status(404).json({ msg: 'Experience not found' });
    }
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create an experience
// @route   POST /api/experiences
// @access  Admin
exports.createExperience = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    description,
    location,
    price,
    duration,
    capacity,
    imageUrl,
  } = req.body;

  try {
    const newExperience = await Experience.create({
      title,
      description,
      location,
      price,
      duration,
      capacity,
      imageUrl,
    });

    res.status(201).json(newExperience);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update an experience
// @route   PUT /api/experiences/:id
// @access  Admin
exports.updateExperience = async (req, res) => {
  const {
    title,
    description,
    location,
    price,
    duration,
    capacity,
    imageUrl,
    isActive,
  } = req.body;

  try {
    let experience = await Experience.findByPk(req.params.id);

    if (!experience) {
      return res.status(404).json({ msg: 'Experience not found' });
    }

    // Update fields
    experience.title = title || experience.title;
    experience.description = description || experience.description;
    experience.location = location || experience.location;
    experience.price = price || experience.price;
    experience.duration = duration || experience.duration;
    experience.capacity = capacity || experience.capacity;
    experience.imageUrl = imageUrl !== undefined ? imageUrl : experience.imageUrl;
    experience.isActive = isActive !== undefined ? isActive : experience.isActive;

    await experience.save();

    res.json(experience);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete an experience
// @route   DELETE /api/experiences/:id
// @access  Admin
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);

    if (!experience) {
      return res.status(404).json({ msg: 'Experience not found' });
    }

    // In a real app, you might want to soft delete or check for existing bookings
    await experience.destroy();

    res.json({ msg: 'Experience removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
