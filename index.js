const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./swagger.config'); // <== Your config file

const app = express();

// dotenv configuration
dotenv.config();

// Middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

// Swagger setup
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
require('./routes/router')(app);

// Base route
app.get('/', (_req, res) => {
  res.status(200).send('Welcome to Restaurant Management System');
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
