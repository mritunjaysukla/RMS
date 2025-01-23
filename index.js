const express = require('express');

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

app.get('/', (_req, res) => {
  return res.status(200).send('Welcome to Restaurant Management System');
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `API documentation available at http://localhost:${PORT}/api-docs`
  );
});
