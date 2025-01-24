const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const app = express();

// dotenv configuration
dotenv.config();

// Middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));
require('./routes/router')(app);
app.use(
  cors({
    origin: ['http://localhost:8080'], // Add allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Add allowed methods
    credentials: true // Allow credentials if needed
  })
);
app.get('/', (_req, res) => {
  return res.status(200).send('Welcome to Restaurant Management System');
});

// Port configuration
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `API documentation available at http://localhost:${PORT}/api-docs`
  );
});
