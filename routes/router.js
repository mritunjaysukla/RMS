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
 *
 * /auth:
 *   get:
 *     tags: [Auth]
 *     summary: Authentication endpoints
 *
 * /api:
 *   get:
 *     tags: [Menu]
 *     summary: Menu management endpoints
 *
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Order management endpoints
 *
 * /reports:
 *   get:
 *     tags: [Reports]
 *     summary: Report management endpoints
 *
 * /tables:
 *   get:
 *     tags: [Tables]
 *     summary: Table management endpoints
 */
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
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        docExpansion: 'none'
      },
      customCss: '.swagger-ui .topbar { display: none }'
    })
  );
};
