const express = require('express');

const swaggerUi = require('swagger-ui-express');

const swaggerFile = require('../config/swagger-output.json');
const userRoutes = require('./user.routes');
const menuRoutes = require('./menu.routes');
const orderRoutes = require('./order.routes');
const reportsRoutes = require('./report.routes');
const tableRoutes = require('./table.routes');
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');

module.exports = (app) => {
  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));

  app.use('/api', authRoutes);

  app.use('/api', userRoutes);

  app.use('/api', menuRoutes);

  app.use('/api', categoryRoutes);

  app.use('/api', orderRoutes);

  app.use('/api', reportsRoutes);

  app.use('/api', tableRoutes);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
};
