const express = require('express');
const cors = require('cors');
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
};
