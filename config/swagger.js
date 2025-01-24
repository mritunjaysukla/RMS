const { serve } = require('swagger-ui-express');

const swaggerAutogen = require('swagger-autogen')();
const PORT = process.env.PORT || 8080;
const doc = {
  swagger: '3.0',
  info: {
    title: 'Restaurant Management System API',
    description: 'API documentation for Restaurant Management System',
    version: '1.0.0',
    contact: {
      email: 'admin@restaurant.com'
    }
  },
  host: 'localhost:8080',
  servers: [
    {
      url: 'http://localhost:8080', // This uses a placeholder for PORT
      description: 'Local Development Server',
      variables: {
        PORT: {
          default: '8080'
        }
      }
    },
    {
      url: 'https://resturant-management-system-production.up.railway.app',
      description: 'Production Server'
    }
  ],

  basePath: '/',
  schemes: ['http', 'https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Bearer token for authentication'
    }
  },
  definitions: {
    User: {
      id: 'integer',
      username: 'string',
      role: { enum: ['ADMIN', 'MANAGER', 'WAITER'] }
    },
    MenuStatus: {
      type: 'string',
      enum: ['Pending', 'Approved', 'Rejected']
    },
    PaymentStatus: {
      type: 'string',
      enum: ['Pending', 'Completed']
    },
    TableAssignmentRole: {
      type: 'string',
      enum: ['Waiter', 'Customer']
    },
    OrderStatus: {
      type: 'string',
      enum: ['Pending', 'Completed']
    },
    MenuItem: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        price: { type: 'number' },
        status: { $ref: '#/definitions/MenuStatus' },
        isApproved: { type: 'boolean' },
        createdById: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    },
    Table: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        table_number: { type: 'integer' },
        qr_code: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    },
    Order: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        tableId: { type: 'integer' },
        items: {
          type: 'array',
          items: { $ref: '#/definitions/OrderItem' }
        }
      }
    },
    OrderItem: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        orderId: { type: 'integer' },
        menuItemId: { type: 'integer' },
        quantity: { type: 'integer' },
        price: { type: 'number' }
      }
    },
    Payment: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        orderId: { type: 'integer' },
        tableId: { type: 'integer' },
        amount: { type: 'number' },
        status: { $ref: '#/definitions/PaymentStatus' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    },
    TableAssignment: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        tableId: { type: 'integer' },
        userId: { type: 'integer' },
        role: { $ref: '#/definitions/TableAssignmentRole' },
        assignedAt: { type: 'string', format: 'date-time' }
      }
    }
  }
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/router.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
