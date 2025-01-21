const swaggerAutogen = require('swagger-autogen')();

const PORT = process.env.PORT;

const doc = {
  info: {
    title: 'Restaurant Management System API',
    description: 'API documentation for Restaurant Management System',
    version: '1.0.0',
    contact: {
      email: 'admin@restaurant.com'
    }
  },
  host: `localhost:${PORT}`,
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication and user management'
    },
    {
      name: 'Menu',
      description: 'Menu management'
    },
    {
      name: 'Orders',
      description: 'Order management'
    },
    {
      name: 'Reports',
      description: 'Report submissions'
    },
    {
      name: 'Tables',
      description: 'Table status and management'
    }
  ],
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
  },

  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user'
      }
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register new user'
      }
    },
    '/api/menu': {
      post: {
        tags: ['Menu'],
        summary: 'Create menu item'
      },
      get: {
        tags: ['Menu'],
        summary: 'Get all menu items'
      }
    },
    '/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Create new order'
      }
    },
    '/reports': {
      get: {
        tags: ['Reports'],
        summary: 'Get reports'
      }
    },
    '/tables': {
      get: {
        tags: ['Tables'],
        summary: 'Get all tables'
      }
    }
  }
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/*.js'];

const generateSwagger = () =>
  swaggerAutogen(outputFile, endpointsFiles, doc)
    .then(() => {
      console.log('Swagger documentation generated successfully!');

      // Start the app after Swagger documentation is ready
      require('../index.js'); // Adjust the path to your app's entry file
    })
    .catch((err) => {
      console.error('Error generating swagger:', err);
      process.exit(1); // Exit with an error code
    });

// Direct execution
generateSwagger();
