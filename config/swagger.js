const _PORT = process.env.PORT || 8080;

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Restaurant Management System API',
      version: '1.0.0',
      description:
        'API for managing restaurant operations, including user authentication, menu management, order processing, staff management, and reporting.',
      contact: {
        email: 'mritunjaysukla07@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${_PORT}`,
        description: 'Local Development Server',
      },
      {
        url: 'https://rms-ext6.onrender.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Bearer token for authentication (e.g., "Bearer <token>").',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Error message' },
          },
        },
        Role: {
          type: 'string',
          enum: ['Admin', 'Manager', 'Waiter'],
          description: 'Role assigned to the user',
        },
        Gender: {
          type: 'string',
          enum: ['Male', 'Female', 'Other'],
          description: 'Gender of the user',
        },
        PasswordReset: {
          type: 'object',
          required: ['userId', 'resetCode', 'expiresAt'],
          properties: {
            id: { type: 'integer', description: 'Unique identifier for the password reset request' },
            userId: { type: 'integer', description: 'ID of the user requesting password reset' },
            resetCode: { type: 'string', description: 'Code for resetting the password' },
            expiresAt: { type: 'string', format: 'date-time', description: 'Expiry timestamp for the reset code' },
            isUsed: { type: 'boolean', description: 'Indicates if the reset code has been used' },
            requestedAt: { type: 'string', format: 'date-time', description: 'Timestamp when the reset was requested' },
          },
        },
        User: {
          type: 'object',
          required: ['id', 'username', 'email', 'contact', 'dob', 'gender', 'role'],
          properties: {
            id: { type: 'integer', description: 'Unique identifier for the user' },
            username: { type: 'string', description: 'Username of the user' },
            email: { type: 'string', format: 'email', description: 'Email address of the user' },
            contact: { type: 'string', description: 'Contact number of the user' },
            dob: { type: 'string', format: 'date', description: 'Date of birth of the user' },
            gender: { $ref: '#/components/schemas/Gender' },
            role: { $ref: '#/components/schemas/Role' },
            isActive: { type: 'boolean', description: 'Indicates if the user is active' },
            createdAt: { type: 'string', format: 'date-time', description: 'Timestamp when the user was created' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Timestamp when the user was last updated' },
          },
        },
        Menu: {
          type: 'object',
          required: ['name', 'categoryId', 'createdById', 'status'],
          properties: {
            id: { type: 'integer', description: 'Unique identifier for the menu' },
            name: { type: 'string', description: 'Name of the menu' },
            categoryId: { type: 'integer', description: 'ID of the category the menu belongs to' },
            createdById: { type: 'integer', description: 'ID of the user who created the menu' },
            status: { $ref: '#/components/schemas/MenuStatus' },
            isApproved: { type: 'boolean', description: 'Indicates if the menu is approved' },
            approvedById: { type: 'integer', nullable: true, description: 'ID of the user who approved the menu' },
            createdAt: { type: 'string', format: 'date-time', description: 'Timestamp when the menu was created' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Timestamp when the menu was last updated' },
            menuItems: { type: 'array', items: { $ref: '#/components/schemas/MenuItem' }, description: 'List of menu items' },
            category: { $ref: '#/components/schemas/FoodCategory' },
            createdBy: { $ref: '#/components/schemas/User' },
            approvedBy: { $ref: '#/components/schemas/User', nullable: true },
          },
        },
        MenuItem: {
          type: 'object',
          required: ['name', 'price', 'categoryId', 'menuId'],
          properties: {
            id: { type: 'integer', description: 'Unique identifier for the menu item' },
            name: { type: 'string', description: 'Name of the menu item' },
            price: { type: 'number', format: 'float', description: 'Price of the menu item' },
            isAvailable: { type: 'boolean', description: 'Indicates if the menu item is available' },
            isPopular: { type: 'boolean', description: 'Indicates if the menu item is popular' },
            categoryId: { type: 'integer', description: 'ID of the category the menu item belongs to' },
            menuId: { type: 'integer', description: 'ID of the menu the item belongs to' },
            category: { $ref: '#/components/schemas/FoodCategory' },
          },
        },
        FoodCategory: {
          type: 'object',
          required: ['name'],
          properties: {
            id: { type: 'integer', description: 'Unique identifier for the category' },
            name: { type: 'string', description: 'Name of the food category' },
            menus: { type: 'array', items: { $ref: '#/components/schemas/Menu' }, description: 'Menus in this category' },
            menuItems: { type: 'array', items: { $ref: '#/components/schemas/MenuItem' }, description: 'Menu items in this category' },
          },
        },
        MenuStatus: {
          type: 'string',
          enum: ['Active', 'Pending', 'Rejected'],
          description: 'Status of the menu',
        },
        Order: {
          type: 'object',
          required: ['orderNumber', 'orderStatus', 'tableId', 'items'],
          properties: {
            id: { type: 'integer', description: 'Unique identifier for the order' },
            orderNumber: { type: 'string', description: 'Unique order number' },
            orderStatus: { $ref: '#/components/schemas/OrderStatus' },
            tableId: { type: 'integer', description: 'ID of the table associated with the order' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['menuItemId', 'quantity'],
                properties: {
                  menuItemId: { type: 'integer', description: 'ID of the menu item' },
                  quantity: { type: 'integer', description: 'Quantity ordered' },
                },
              },
              description: 'List of items in the order',
            },
            specialInstructions: { type: 'string', nullable: true, description: 'Special instructions for the order' },
            discount: { type: 'number', format: 'float', nullable: true, description: 'Discount applied to the order' },
            createdAt: { type: 'string', format: 'date-time', description: 'Timestamp when the order was created' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Timestamp when the order was last updated' },
          },
        },
        OrderStatus: {
          type: 'string',
          enum: ['Preparing', 'Served', 'Rejected'],
          description: 'Status of the order',
        },
        StaffOnDuty: {
          type: 'object',
          required: ['name', 'status', 'role', 'contact', 'dob', 'gender'],
          properties: {
            id: { type: 'integer', description: 'Unique identifier for the staff member' },
            name: { type: 'string', description: 'Name of the staff member' },
            status: { $ref: '#/components/schemas/StaffStatus' },
            role: { $ref: '#/components/schemas/Role' },
            contact: { type: 'string', description: 'Contact number of the staff member' },
            dob: { type: 'string', format: 'date', description: 'Date of birth of the staff member' },
            gender: { $ref: '#/components/schemas/Gender' },
            serviceTime: { type: 'string', nullable: true, description: 'Duration of service' },
            performanceStatus: {
              type: 'object',
              properties: {
                today: {
                  type: 'object',
                  properties: {
                    ordersServed: { type: 'integer', description: 'Number of orders served today' },
                    averageTime: { type: 'string', description: 'Average time to serve orders' },
                  },
                },
              },
              description: 'Staff performance metrics',
            },
          },
        },
        StaffStatus: {
          type: 'string',
          enum: ['Active', 'Inactive', 'OnBreak'],
          description: 'Status of the staff member',
        },
        Report: {
          type: 'object',
          required: ['period', 'totalOrders', 'totalSales', 'managerId', 'submittedToId'],
          properties: {
            id: { type: 'integer', description: 'Unique identifier for the report' },
            period: { $ref: '#/components/schemas/ReportPeriod' },
            totalOrders: { type: 'integer', description: 'Total number of orders in the report' },
            totalSales: { type: 'number', format: 'float', description: 'Total sales amount in the report' },
            managerId: { type: 'integer', description: 'ID of the manager who created the report' },
            submittedToId: { type: 'integer', description: 'ID of the user the report was submitted to' },
            createdAt: { type: 'string', format: 'date-time', description: 'Timestamp when the report was created' },
          },
        },
        ReportPeriod: {
          type: 'string',
          enum: ['Daily', 'Weekly', 'Monthly'],
          description: 'Reporting period',
        },
      },
    },
    paths: {
      '/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          description: 'Registers a new user with provided details.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password', 'contact', 'dob', 'gender', 'role'],
                  properties: {
                    username: { type: 'string', example: 'john_doe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', format: 'password', example: 'Password123!' },
                    contact: { type: 'string', example: '1234567890' },
                    dob: { type: 'string', format: 'date', example: '1990-01-01' },
                    gender: { $ref: '#/components/schemas/Gender' },
                    role: { $ref: '#/components/schemas/Role' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
            400: {
              description: 'Invalid input or email already registered',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/login': {
        post: {
          tags: ['Authentication'],
          summary: 'User login',
          description: 'Authenticates a user and returns a JWT token.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', format: 'password', example: 'Password123!' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string', description: 'JWT token for authentication' },
                      user: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Invalid credentials',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/forgot-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Request password reset',
          description: 'Sends a password reset code to the user’s email.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Reset code sent successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Reset code sent to email' },
                    },
                  },
                },
              },
            },
            404: {
              description: 'User not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/reset-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Reset user password',
          description: 'Resets the user’s password using a valid reset code.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'resetCode', 'newPassword', 'confirmNewPassword'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    resetCode: { type: 'string', example: '123456' },
                    newPassword: { type: 'string', format: 'password', example: 'NewPassword123!' },
                    confirmNewPassword: { type: 'string', format: 'password', example: 'NewPassword123!' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Password reset successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Password reset successfully' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid reset code or passwords do not match',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'User or reset code not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Log out a user',
          description: 'Invalidates the user’s session or JWT token.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User logged out successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'User logged out successfully' },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users',
          description: 'Fetches a list of all users (excluding sensitive fields like passwords). Requires Admin or Manager role.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Users fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
        post: {
          tags: ['Users'],
          summary: 'Create a new user',
          description: 'Creates a new user. Requires Admin role.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password', 'contact', 'dob', 'gender', 'role'],
                  properties: {
                    username: { type: 'string', example: 'jane_doe' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    password: { type: 'string', format: 'password', example: 'Password123!' },
                    contact: { type: 'string', example: '0987654321' },
                    dob: { type: 'string', format: 'date', example: '1992-02-02' },
                    gender: { $ref: '#/components/schemas/Gender' },
                    role: { $ref: '#/components/schemas/Role' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User created successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/User' } },
              },
            },
            400: {
              description: 'Invalid input or email already exists',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get a specific user',
          description: 'Fetches a user by ID (excluding sensitive fields like passwords). Requires Admin or Manager role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'User ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'User fetched successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/User' } },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'User not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
        put: {
          tags: ['Users'],
          summary: 'Update a user',
          description: 'Updates a user’s details by ID. Requires Admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'User ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string', example: 'jane_doe_updated' },
                    email: { type: 'string', format: 'email', example: 'jane_updated@example.com' },
                    contact: { type: 'string', example: '0987654321' },
                    dob: { type: 'string', format: 'date', example: '1992-02-02' },
                    gender: { $ref: '#/components/schemas/Gender' },
                    role: { $ref: '#/components/schemas/Role' },
                    isActive: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'User updated successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/User' } },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'User not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete a user',
          description: 'Deletes a user by ID. Requires Admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'User ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'User deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'User deleted successfully' },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'User not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/menus': {
        post: {
          tags: ['Menu'],
          summary: 'Create a new menu with items',
          description: 'Creates a new menu with associated items. Requires Manager role.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'categoryId', 'items'],
                  properties: {
                    name: { type: 'string', example: 'Summer Menu' },
                    categoryId: { type: 'integer', example: 1 },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['name', 'price', 'categoryId'],
                        properties: {
                          name: { type: 'string', example: 'Grilled Salmon' },
                          price: { type: 'number', format: 'float', example: 24.99 },
                          categoryId: { type: 'integer', example: 1 },
                          isPopular: { type: 'boolean', example: true },
                          isAvailable: { type: 'boolean', example: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Menu created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      menu: { $ref: '#/components/schemas/Menu' },
                      menuItems: { type: 'array', items: { $ref: '#/components/schemas/MenuItem' } },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid input or category does not exist',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
        get: {
          tags: ['Menu'],
          summary: 'Get all menus with filters',
          description: 'Fetches menus with optional filters for status, category, or popularity.',
          parameters: [
            {
              name: 'status',
              in: 'query',
              description: 'Filter by menu status',
              schema: { $ref: '#/components/schemas/MenuStatus' },
            },
            {
              name: 'categoryId',
              in: 'query',
              description: 'Filter by category ID',
              schema: { type: 'integer', example: 1 },
            },
            {
              name: 'isPopular',
              in: 'query',
              description: 'Filter by popularity',
              schema: { type: 'boolean', example: true },
            },
          ],
          responses: {
            200: {
              description: 'Menus fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Menu' },
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/menus/{id}': {
        patch: {
          tags: ['Menu'],
          summary: 'Update a menu',
          description: 'Updates menu details (name, categoryId, isPopular). Requires Manager role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Menu ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Summer Menu' },
                    categoryId: { type: 'integer', example: 1 },
                    isPopular: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Menu updated successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Menu' } },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'Menu not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
        delete: {
          tags: ['Menu'],
          summary: 'Delete a menu',
          description: 'Deletes a menu by ID. Requires Manager role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Menu ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Menu deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Menu deleted successfully' },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'Menu not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/menus/{id}/status': {
        put: {
          tags: ['Menu'],
          summary: 'Update menu status',
          description: 'Updates the status of a menu (e.g., approve or reject). Requires Admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Menu ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { $ref: '#/components/schemas/MenuStatus' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Menu status updated successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Menu' } },
              },
            },
            400: {
              description: 'Invalid status',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'Menu not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/categories': {
        post: {
          tags: ['Category'],
          summary: 'Create a new food category',
          description: 'Creates a new food category. Requires Admin role.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Desserts' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Category created successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/FoodCategory' } },
              },
            },
            400: {
              description: 'Invalid input or category name already exists',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
        get: {
          tags: ['Category'],
          summary: 'Get all food categories',
          description: 'Fetches a list of all food categories.',
          responses: {
            200: {
              description: 'Categories fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/FoodCategory' },
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/categories/{id}': {
        put: {
          tags: ['Category'],
          summary: 'Update a food category',
          description: 'Updates a food category by ID. Requires Admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Category ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Sweet Treats' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Category updated successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/FoodCategory' } },
              },
            },
            400: {
              description: 'Invalid input or category name already exists',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'Category not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
        delete: {
          tags: ['Category'],
          summary: 'Delete a food category',
          description: 'Deletes a food category by ID. Requires Admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Category ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Category deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Category deleted successfully' },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'Category not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/orders': {
        post: {
          tags: ['Order'],
          summary: 'Create a new order',
          description: 'Creates a new order with items. Requires Waiter role.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['tableId', 'items'],
                  properties: {
                    tableId: { type: 'integer', example: 1 },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['menuItemId', 'quantity'],
                        properties: {
                          menuItemId: { type: 'integer', example: 1 },
                          quantity: { type: 'integer', example: 2 },
                        },
                      },
                    },
                    specialInstructions: { type: 'string', example: 'No onions', nullable: true },
                    discount: { type: 'number', format: 'float', example: 10.0, nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Order created successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Order' } },
              },
            },
            400: {
              description: 'Invalid input or menu item not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
        get: {
          tags: ['Order'],
          summary: 'Get all orders with filters',
          description: 'Fetches orders with optional filters for status, date range, or waiter. Requires Manager or Admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'status',
              in: 'query',
              description: 'Filter by order status',
              schema: { $ref: '#/components/schemas/OrderStatus' },
            },
            {
              name: 'startDate',
              in: 'query',
              description: 'Filter by start date (YYYY-MM-DD)',
              schema: { type: 'string', format: 'date', example: '2025-06-01' },
            },
            {
              name: 'endDate',
              in: 'query',
              description: 'Filter by end date (YYYY-MM-DD)',
              schema: { type: 'string', format: 'date', example: '2025-06-30' },
            },
            {
              name: 'waiterId',
              in: 'query',
              description: 'Filter by waiter ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Orders fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/orders/{id}': {
        get: {
          tags: ['Order'],
          summary: 'Get order details',
          description: 'Fetches details of a specific order by ID. Requires Manager or Admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Order ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Order fetched successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Order' } },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'Order not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/orders/{id}/status': {
        patch: {
          tags: ['Order'],
          summary: 'Update order status',
          description: 'Updates the status of an order (e.g., Preparing, Served, Rejected). Requires Manager role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Order ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { $ref: '#/components/schemas/OrderStatus' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Order status updated successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Order' } },
              },
            },
            400: {
              description: 'Invalid status',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'Order not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/staff': {
        get: {
          tags: ['Staff'],
          summary: 'Get all staff members',
          description: 'Fetches a list of all staff members. Requires Admin or Manager role.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Staff members fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/StaffOnDuty' },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/staff/on-duty': {
        get: {
          tags: ['Staff'],
          summary: 'Get staff on duty',
          description: 'Fetches a list of staff members currently on duty with optional filters. Requires Manager or Admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'role',
              in: 'query',
              description: 'Filter by staff role',
              schema: { $ref: '#/components/schemas/Role' },
            },
            {
              name: 'status',
              in: 'query',
              description: 'Filter by staff status',
              schema: { $ref: '#/components/schemas/StaffStatus' },
            },
            {
              name: 'startDate',
              in: 'query',
              description: 'Filter by start date (YYYY-MM-DD)',
              schema: { type: 'string', format: 'date', example: '2025-06-01' },
            },
            {
              name: 'endDate',
              in: 'query',
              description: 'Filter by end date (YYYY-MM-DD)',
              schema: { type: 'string', format: 'date', example: '2025-06-30' },
            },
          ],
          responses: {
            200: {
              description: 'Staff on duty fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/StaffOnDuty' },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/staff/{id}': {
        delete: {
          tags: ['Staff'],
          summary: 'Delete a staff member',
          description: 'Deletes a staff member by ID. Requires Admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Staff member ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Staff member deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Staff member deleted successfully' },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'Staff member not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/reports': {
        post: {
          tags: ['Report'],
          summary: 'Generate a new report',
          description: 'Generates a report for a specific period. Requires Manager role.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['period', 'submittedToId'],
                  properties: {
                    period: { $ref: '#/components/schemas/ReportPeriod' },
                    submittedToId: { type: 'integer', example: 1, description: 'ID of the admin to whom the report is submitted' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Report generated successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Report' } },
              },
            },
            400: {
              description: 'Invalid input',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'Admin not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
        get: {
          tags: ['Report'],
          summary: 'Get all reports',
          description: 'Fetches a list of all reports. Requires Admin role.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Reports fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Report' },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/reports/{id}': {
        get: {
          tags: ['Report'],
          summary: 'Get report details',
          description: 'Fetches detailed information about a specific report, including table-wise and order-wise breakdowns. Requires Admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Report ID',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Report details fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      period: { $ref: '#/components/schemas/ReportPeriod' },
                      totalOrders: { type: 'integer', example: 100 },
                      totalSales: { type: 'number', format: 'float', example: 5000.0 },
                      tables: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            tableNumber: { type: 'string', example: 'T1' },
                            totalOrder: { type: 'integer', example: 10 },
                            totalSales: { type: 'number', format: 'float', example: 500.0 },
                            orders: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  timeSlot: { type: 'string', format: 'date-time', example: '2025-06-30T12:00:00Z' },
                                  items: {
                                    type: 'array',
                                    items: {
                                      type: 'object',
                                      properties: {
                                        name: { type: 'string', example: 'Grilled Salmon' },
                                        quantity: { type: 'integer', example: 2 },
                                        price: { type: 'number', format: 'float', example: 24.99 },
                                      },
                                    },
                                  },
                                  subtotal: { type: 'number', format: 'float', example: 49.98 },
                                  tax: { type: 'number', format: 'float', example: 4.99 },
                                  total: { type: 'number', format: 'float', example: 54.97 },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            403: {
              description: 'Forbidden: Insufficient role permissions',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            404: {
              description: 'Report not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    '../routes/user.routes.js',
    '../routes/auth.routes.js',
    '../routes/menu.routes.js',
    '../routes/category.routes.js',
    '../routes/order.routes.js',
    '../routes/staff.routes.js',
    '../routes/report.routes.js',
  ],
};

module.exports = options;