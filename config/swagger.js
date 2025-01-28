const { serve } = require('swagger-ui-express');

const swaggerAutogen = require('swagger-autogen')();
const _PORT = process.env.PORT || 8080;
const doc = {
  swagger: '3.0',
  info: {
    title: 'Restaurant Management System API',
    description: 'API documentation for Restaurant Management System',
    version: '1.0.0',
    contact: {
      email: 'mritunjaysukla07@gmail.com'
    }
  },
  host: 'localhost:8080',
  basePath: '/',
  schemes: ['http', 'https'],
  servers: [
    {
      url: 'http://localhost:8080', // Local server URL
      description: 'Local Development Server'
    },
    {
      url: 'https://restaurant-management-system-production.up.railway.app',
      description: 'Production Server'
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
      type: 'object',
      properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
        contact: { type: 'string' },
        dob: { type: 'string', format: 'date-time' },
        gender: { $ref: '#/definitions/Gender' },
        role: { $ref: '#/definitions/Role' },
        createdById: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        isActive: { type: 'boolean' }
      }
    },
    Role: {
      type: 'string',
      enum: ['Admin', 'Manager', 'Waiter']
    },
    Gender: {
      type: 'string',
      enum: ['Male', 'Female', 'Other']
    },
    MenuStatus: {
      type: 'string',
      enum: ['Active', 'Pending', 'Rejected']
    },
    OrderStatus: {
      type: 'string',
      enum: ['Preparing', 'Served', 'Rejected']
    },
    ReportPeriod: {
      type: 'string',
      enum: ['Daily', 'Weekly', 'Monthly']
    },
    Menu: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        createdById: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        isApproved: { type: 'boolean' },
        approvedById: { type: 'integer' },
        status: { $ref: '#/definitions/MenuStatus' },
        categoryId: { type: 'integer' },
        isPopular: { type: 'boolean' }
      }
    },
    MenuItem: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        menuId: { type: 'integer' },
        name: { type: 'string' },
        price: { type: 'number' },
        isAvailable: { type: 'boolean' },
        categoryId: { type: 'integer' },
        isPopular: { type: 'boolean' }
      }
    },
    FoodCategory: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' }
      }
    },
    Table: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        table_number: { type: 'string' },
        capacity: { type: 'integer' },
        isAvailable: { type: 'boolean' }
      }
    },
    TableAssignment: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        tableId: { type: 'integer' },
        assignedAt: { type: 'string', format: 'date-time' }
      }
    },
    Order: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        order_number: { type: 'string' },
        tableId: { type: 'integer' },
        waiterId: { type: 'integer' },
        order_date: { type: 'string', format: 'date-time' },
        order_status: { $ref: '#/definitions/OrderStatus' },
        special_instructions: { type: 'string' },
        duration: { type: 'integer' },
        createdById: { type: 'integer' },
        reportId: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    },
    OrderDetails: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        orderId: { type: 'integer' },
        menuItemId: { type: 'integer' },
        quantity: { type: 'integer' },
        unit_price: { type: 'number' },
        total_price: { type: 'number' }
      }
    },
    BillingDetails: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        orderId: { type: 'integer' },
        subtotal: { type: 'number' },
        tax: { type: 'number' },
        discount: { type: 'number' },
        total: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    },
    Report: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        managerId: { type: 'integer' },
        submittedToId: { type: 'integer' },
        total_orders: { type: 'integer' },
        total_sales: { type: 'number' },
        period: { $ref: '#/definitions/ReportPeriod' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    },
    PasswordReset: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        reset_code: { type: 'string' },
        expires_at: { type: 'string', format: 'date-time' },
        is_used: { type: 'boolean' },
        requested_at: { type: 'string', format: 'date-time' }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/router.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
