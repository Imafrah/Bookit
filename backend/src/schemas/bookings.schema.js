const { z } = require('zod');

const bookingCreateSchema = z.object({
  experienceId: z.number().int().positive(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  bookingDate: z.string().min(1), // ISO date string
  startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format'),
  endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format').optional(),
  numberOfPeople: z.number().int().positive().default(1),
  promoCode: z.string().min(1).optional(),
  specialRequests: z.string().optional(),
});

module.exports = {
  bookingCreateSchema,
};
