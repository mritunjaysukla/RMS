const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerFile = require('../config/swagger-output.json');
const authRoutes = require('./auth.routes');
const menuRoutes = require('./menu.routes');
const orderRoutes = require('./order.routes');
const reportsRoutes = require('./report.routes');
const tableRoutes = require('./table.routes');
const userRoutes = require('./user.routes');

module.exports = (app) => {
  app.use(express.json());

  app.use(cors());

  app.use(express.urlencoded({ extended: false }));

  app.use('/api', authRoutes);

  app.use('/users', userRoutes);

  app.use('/menu', menuRoutes);

  app.use('/orders', orderRoutes);

  app.use('/reports', reportsRoutes);

  app.use('/tables', tableRoutes);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
};
