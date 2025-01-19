const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0', // Specify OpenAPI version
  info: {
    title: 'RESTURANT MANAGEMENT SYSTEM', // API title
    version: '1.0.0', // API version
    description: 'API documentation for RMS' // Short description
  },
  servers: [
    {
      url: 'http://localhost:8080', // Base URL
      description: 'Development server' // Environment name
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'] // Path to your API docs (use glob pattern to include multiple files)
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
