const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const PromoCode = require('../models/PromoCode');

// @desc    Validate a promo code
// @route   POST /api/promo/validate
// @access  Public
exports.validatePromoCode = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { code, amount } = req.body;

  try {
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
      return res.status(400).json({ 
        valid: false, 
        message: 'Invalid or expired promo code' 
      });
    }

    // Check minimum order amount if specified
    if (promoCode.minOrderAmount && amount < promoCode.minOrderAmount) {
      return res.status(400).json({ 
        valid: false, 
        message: `Minimum order amount of ${promoCode.minOrderAmount} required` 
      });
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

    // Prepare response
    const response = {
      valid: true,
      code: promoCode.code,
      description: promoCode.description,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      discountAmount,
      finalPrice,
      minOrderAmount: promoCode.minOrderAmount,
      maxDiscount: promoCode.maxDiscount,
    };

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all promo codes
// @route   GET /api/promo
// @access  Admin
exports.getPromoCodes = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    
    const whereClause = {};
    
    if (activeOnly === 'true') {
      whereClause.isActive = true;
      whereClause.startDate = { [Op.lte]: new Date() };
      whereClause[Op.or] = [
        { endDate: null },
        { endDate: { [Op.gte]: new Date() } }
      ];
      whereClause[Op.or] = [
        { maxUses: null },
        { useCount: { [Op.lt]: { [Op.col]: 'maxUses' } } }
      ];
    }
    
    const promoCodes = await PromoCode.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });
    
    res.json(promoCodes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new promo code
// @route   POST /api/promo
// @access  Admin
exports.createPromoCode = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    code,
    description,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    startDate,
    endDate,
    maxUses,
  } = req.body;

  try {
    // Check if promo code already exists
    let promoCode = await PromoCode.findOne({ where: { code: code.toUpperCase() } });
    
    if (promoCode) {
      return res.status(400).json({ msg: 'Promo code already exists' });
    }

    // Create new promo code
    promoCode = await PromoCode.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || null,
      maxDiscount: discountType === 'percentage' ? maxDiscount || null : null,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      maxUses: maxUses || null,
      useCount: 0,
      isActive: true,
    });

    res.status(201).json(promoCode);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a promo code
// @route   PUT /api/promo/:id
// @access  Admin
exports.updatePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findByPk(req.params.id);
    
    if (!promoCode) {
      return res.status(404).json({ msg: 'Promo code not found' });
    }

    const {
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      startDate,
      endDate,
      maxUses,
      isActive,
    } = req.body;

    // Update fields
    if (description !== undefined) promoCode.description = description;
    if (discountType !== undefined) promoCode.discountType = discountType;
    if (discountValue !== undefined) promoCode.discountValue = discountValue;
    if (minOrderAmount !== undefined) promoCode.minOrderAmount = minOrderAmount;
    if (maxDiscount !== undefined) promoCode.maxDiscount = maxDiscount;
    if (startDate !== undefined) promoCode.startDate = new Date(startDate);
    if (endDate !== undefined) promoCode.endDate = endDate ? new Date(endDate) : null;
    if (maxUses !== undefined) promoCode.maxUses = maxUses;
    if (isActive !== undefined) promoCode.isActive = isActive;

    await promoCode.save();

    res.json(promoCode);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a promo code
// @route   DELETE /api/promo/:id
// @access  Admin
exports.deletePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findByPk(req.params.id);
    
    if (!promoCode) {
      return res.status(404).json({ msg: 'Promo code not found' });
    }

    await promoCode.destroy();

    res.json({ msg: 'Promo code removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
