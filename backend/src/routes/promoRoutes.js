const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promoController');
const validate = require('../middleware/validate');
const { promoValidateSchema } = require('../schemas/promo.schema');

// @route   POST /api/promo/validate
// @desc    Validate a promo code
// @access  Public
router.post('/validate', validate({ body: promoValidateSchema }), promoController.validatePromoCode);

// @route   GET /api/promo
// @desc    Get all active promo codes (Admin only)
// @access  Admin
router.get('/', promoController.getPromoCodes);

// @route   POST /api/promo
// @desc    Create a new promo code (Admin only)
// @access  Admin
router.post('/', promoController.createPromoCode);

// @route   PUT /api/promo/:id
// @desc    Update a promo code (Admin only)
// @access  Admin
router.put('/:id', promoController.updatePromoCode);

// @route   DELETE /api/promo/:id
// @desc    Delete a promo code (Admin only)
// @access  Admin
router.delete('/:id', promoController.deletePromoCode);

module.exports = router;
