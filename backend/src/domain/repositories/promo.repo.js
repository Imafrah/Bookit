const { Op } = require('sequelize');
const PromoCode = require('../../models/PromoCode');

async function findActiveByCode(code) {
  return PromoCode.findOne({
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
}

module.exports = {
  findActiveByCode,
};
