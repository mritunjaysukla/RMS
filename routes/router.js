const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/swagger-output.json');

const authRoutes = require('./auth.routes');
const menuRoutes = require('./menu.routes');
const orderRoutes = require('./order.routes');
const reportsRoutes = require('./report.routes');
const tableRoutes = require('./table.routes');
module.exports = (app) => {
  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use('/auth', authRoutes);
  app.use('/api', menuRoutes);
  app.use('/orders', orderRoutes);
  app.use('/reports', reportsRoutes);
  app.use('/tables', tableRoutes);
  // Swagger UI route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
