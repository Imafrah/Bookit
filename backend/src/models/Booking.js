const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Booking = db.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  experienceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'experiences',
      key: 'id',
    },
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  bookingDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  numberOfPeople: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  promoCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'confirmed',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
  tableName: 'bookings',
});

module.exports = Booking;
