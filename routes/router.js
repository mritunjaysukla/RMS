const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('../config/swagger'); // Adjust the path as necessary

const userRoutes = require('./user.routes');
const menuRoutes = require('./menu.routes');
const orderRoutes = require('./order.routes');
const reportsRoutes = require('./report.routes');
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const staffRoutes = require('./staff.routes');

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use('/api', authRoutes);
  app.use('/api', userRoutes);
  app.use('/api', staffRoutes);
  app.use('/api', menuRoutes);
  app.use('/api', categoryRoutes);
  app.use('/api', orderRoutes);
  app.use('/api', reportsRoutes);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
