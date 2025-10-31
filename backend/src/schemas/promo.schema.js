const { z } = require('zod');

const promoValidateSchema = z.object({
  code: z.string().min(1),
  amount: z.number().nonnegative(),
});

module.exports = {
  promoValidateSchema,
};
