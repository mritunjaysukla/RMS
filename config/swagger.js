const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Restaurant Management System API',
    description: 'API documentation for the Restaurant Management System',
    version: '1.0.0'
  },
  host: 'localhost:8080', // Base URL for the API
  schemes: ['http'], // Protocols (http/https)
  securityDefinitions: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  tags: [
    { name: 'Auth', description: 'Authentication and user management' },
    { name: 'Menu', description: 'Menu management' },
    { name: 'Orders', description: 'Order management' },
    { name: 'Reports', description: 'Report submissions' },
    { name: 'Tables', description: 'Table status and management' }
  ]
};

const outputFile = './config/swagger-output.json'; // Output file for Swagger JSON
const endpointsFiles = ['./routes/router.js']; // Main router file

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger JSON generated successfully!');
});

module.exports = outputFile;
