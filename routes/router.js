const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/swagger-output.json');

const authRoutes = require('./auth.routes');
const menuRoutes = require('./menu.routes');
const orderRoutes = require('./order.routes');
const reportsRoutes = require('./report.routes');
const tableRoutes = require('./table.routes');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and user management
 *   - name: Menu
 *     description: Menu management
 *   - name: Orders
 *     description: Order management
 *   - name: Reports
 *     description: Report submissions
 *   - name: Tables
 *     description: Table status and management
 */

module.exports = (app) => {
  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));

  // Routes with Swagger documentation
  /**
   * @swagger
   * /auth:
   *   tags: [Auth]
   */
  app.use('/auth', authRoutes);

  /**
   * @swagger
   * /api:
   *   tags: [Menu]
   */
  app.use('/api', menuRoutes);

  /**
   * @swagger
   * /orders:
   *   tags: [Orders]
   */
  app.use('/orders', orderRoutes);

  /**
   * @swagger
   * /reports:
   *   tags: [Reports]
   */
  app.use('/reports', reportsRoutes);

  /**
   * @swagger
   * /tables:
   *   tags: [Tables]
   */
  app.use('/tables', tableRoutes);

  // Swagger UI route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
