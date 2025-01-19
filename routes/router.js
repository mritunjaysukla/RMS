const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/swagger');

const authRoutes = require('./auth.Routes');
const menuRoutes = require('./menu.Routes');
const orderRoutes = require('./order.Routes');
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
  /**
   * @swagger
   * /protected:
   *   get:
   *     summary: Access protected resource
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Access granted
   *       401:
   *         description: Unauthorized
   */
  app.get('/protected', (req, res) => {
    res.send('Protected resource');
  });
};
