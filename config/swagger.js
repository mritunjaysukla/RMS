const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Restaurant Management API',
    version: '1.0.0'
  },
  apis: ['./index.js', './routes/*.routes.js'],
  host: 'localhost:5000',
  basePath: '/',

  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints'
    },
    {
      name: 'Menu',
      description: 'Menu management'
    },
    {
      name: 'Orders',
      description: 'Order operations'
    },
    {
      name: 'Tables',
      description: 'Table management'
    }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization'
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./index.js', './routes/*.js'];

// Generate swagger.json
swaggerAutogen(outputFile, routes, doc).then(() => {
  require('../index.js'); // Your project entry point 
});