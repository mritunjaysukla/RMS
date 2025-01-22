const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

  // Group routes by domain
  const authPrefix = '/auth';
  const menuPrefix = '/api/menu';
  const orderPrefix = '/api/orders';
  const tablePrefix = '/api/tables';

  // Apply route prefixes
  app.use(authPrefix, require('./auth.routes'));
  app.use(menuPrefix, require('./menu.routes'));
  app.use(orderPrefix, require('./order.routes'));
  app.use(tablePrefix, require('./table.routes'));
};