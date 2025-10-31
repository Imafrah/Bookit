const Experience = require('../../models/Experience');

async function findById(id) {
  return Experience.findByPk(id);
}

module.exports = {
  findById,
};
