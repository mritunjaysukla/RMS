const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const validateRole = require('./middlewares/role.Middleware'); // Importing role validation middleware
const { auth, authorize } = require('./middlewares/auth.Middleware');

const app = express();

// dotenv configuration
dotenv.config();

// Middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));
require('./routes/router')(app);

// Protected routes with admin role validation

app.get(
  '/reports',
  auth,
  authorize,
  validateRole(['ADMIN', 'MANAGER']),
  (_req, res) => {
    // Logic to fetch and send reports
    res.send('Reports fetched successfully');
  }
);

app.get('/', (_req, res) => {
  return res.status(200).send('Welcome to Restaurant Management System');
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
