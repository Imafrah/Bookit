const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const db = require('./config/db');
const Experience = require('./models/Experience');
const PromoCode = require('./models/PromoCode');

async function seed() {
  try {
    await db.authenticate();
    console.log('DB authenticated');

    const experiences = [
      {
        title: 'Kayak Tour',
        description: 'Guided river tour',
        location: 'City Park',
        price: 59.99,
        duration: 90,
        capacity: 8,
        imageUrl: null,
        isActive: true,
      },
      {
        title: 'Mountain Hike',
        description: 'Half-day guided hike',
        location: 'Hill Base',
        price: 89.0,
        duration: 240,
        capacity: 12,
        imageUrl: null,
        isActive: true,
      },
      {
        title: 'Cooking Class',
        description: 'Make pasta from scratch',
        location: 'Downtown Studio',
        price: 39.99,
        duration: 120,
        capacity: 10,
        imageUrl: null,
        isActive: true,
      },
    ];

    const promoCodes = [
      {
        code: 'WELCOME10',
        description: '10% off first booking',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: null,
        maxDiscount: null,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxUses: 100,
        useCount: 0,
        isActive: true,
      },
      {
        code: 'SAVE20',
        description: 'Flat 20 off',
        discountType: 'fixed',
        discountValue: 20,
        minOrderAmount: 100,
        maxDiscount: null,
        startDate: new Date(),
        endDate: null,
        maxUses: 1000,
        useCount: 0,
        isActive: true,
      },
      {
        code: 'SAVE10',
        description: '10% off',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: null,
        maxDiscount: null,
        startDate: new Date(),
        endDate: null,
        maxUses: 1000,
        useCount: 0,
        isActive: true,
      },
      {
        code: 'FLAT100',
        description: 'Flat 100 off',
        discountType: 'fixed',
        discountValue: 100,
        minOrderAmount: 200,
        maxDiscount: null,
        startDate: new Date(),
        endDate: null,
        maxUses: 1000,
        useCount: 0,
        isActive: true,
      },
    ];

    // Create tables if they don't exist
    await db.sync();

    // Seed Experiences (idempotent-ish via findOrCreate on title)
    for (const e of experiences) {
      await Experience.findOrCreate({ where: { title: e.title }, defaults: e });
    }
    console.log('Seeded Experiences');

    // Seed PromoCodes (idempotent thanks to unique code)
    for (const p of promoCodes) {
      await PromoCode.findOrCreate({ where: { code: p.code }, defaults: p });
    }
    console.log('Seeded PromoCodes');

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
