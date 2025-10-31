const app = require('../src/app');

module.exports = (req, res) => {
  // Ensure our Express app, which defines routes under '/api', receives the expected path
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url === '/' ? '' : req.url);
  }
  return app(req, res);
};
