const { ZodError } = require('zod');

function validate(schema) {
  return (req, res, next) => {
    try {
      const data = {
        body: req.body,
        query: req.query,
        params: req.params,
      };
      // Support schemas defined for body, query, params separately or a single schema on body
      if (schema.body || schema.query || schema.params) {
        if (schema.body) req.body = schema.body.parse(req.body);
        if (schema.query) req.query = schema.query.parse(req.query);
        if (schema.params) req.params = schema.params.parse(req.params);
      } else {
        req.body = schema.parse(req.body);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          msg: 'Validation failed',
          errors: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
        });
      }
      next(err);
    }
  };
}

module.exports = validate;
