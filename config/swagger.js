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
  host: `localhost:${_PORT}`,
  basePath: '/',
  schemes: ['http', 'https'],
  servers: [
    {
      url: `http://localhost:${_PORT}`,
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
        dob: { type: 'string', format: 'date' },
        gender: { $ref: '#/definitions/Gender' },
        role: { $ref: '#/definitions/Role' },
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
    },
    Menu: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        categoryId: { type: 'integer' },
        createdById: { type: 'integer' },
        status: { $ref: '#/definitions/MenuStatus' },
        isApproved: { type: 'boolean' },
        approvedById: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        MenuItems: { type: 'array', items: { $ref: '#/definitions/MenuItem' } },
        category: { $ref: '#/definitions/FoodCategory' },
        created_by: { $ref: '#/definitions/User' },
        approved_by: { $ref: '#/definitions/User' }
      }
    },
    MenuItem: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        price: { type: 'number', format: 'float' },
        isAvailable: { type: 'boolean' },
        isPopular: { type: 'boolean' },
        categoryId: { type: 'integer' },
        menuId: { type: 'integer' },
        category: { $ref: '#/definitions/FoodCategory' }
      }
    },
    FoodCategory: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        Menu: { type: 'array', items: { $ref: '#/definitions/Menu' } },
        MenuItem: { type: 'array', items: { $ref: '#/definitions/MenuItem' } }
      }
    },
    MenuStatus: {
      type: 'string',
      enum: ['Active', 'Pending', 'Rejected']
    },
    Order: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        order_number: { type: 'string' },
        order_status: { $ref: '#/definitions/OrderStatus' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    },
    StaffOnDuty: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        status: { $ref: '#/definitions/StaffStatus' },
        role: { $ref: '#/definitions/Role' },
        contact: { type: 'string' },
        dob: { type: 'string', format: 'date' },
        gender: { $ref: '#/definitions/Gender' },
        serviceTime: { type: 'string' },
        performanceStatus: {
          type: 'object',
          properties: {
            today: {
              type: 'object',
              properties: {
                ordersServed: { type: 'integer' },
                averageTime: { type: 'string' }
              }
            }
          }
        }
      }
    },

    OrderStatus: {
      type: 'string',
      enum: ['Preparing', 'Served', 'Rejected']
    },
    StaffStatus: {
      type: 'string',
      enum: ['Active', 'Inactive', 'OnBreak']
    },
    Report: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        period: { $ref: '#/definitions/ReportPeriod' },
        total_orders: { type: 'integer' },
        total_sales: { type: 'number', format: 'float' },
        managerId: { type: 'integer' },
        submittedToId: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    },
    ReportPeriod: {
      type: 'string',
      enum: ['Daily', 'Weekly', 'Monthly']
    }
  },
  paths: {
    '/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        description:
          'Registers a user with username, email, password, role, contact, DOB, and gender.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                  role: { $ref: '#/definitions/Role' },
                  email: { type: 'string' },
                  contact: { type: 'string' },
                  dob: { type: 'string', format: 'date' },
                  gender: { $ref: '#/definitions/Gender' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Email already registered' },
          500: { description: 'Registration failed' }
        }
      }
    },
    '/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User login',
        description: 'Logs in a user and returns a JWT token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
          500: { description: 'Internal server error' }
        }
      }
    },
    '/forgot-password': {
      post: {
        tags: ['Password Reset'],
        summary: 'Request password reset',
        description: 'Sends a password reset code to the user’s email.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Reset code sent successfully' },
          404: { description: 'User not found' },
          500: { description: 'Failed to send reset code' }
        }
      }
    },
    '/reset-password': {
      post: {
        tags: ['Password Reset'],
        summary: 'Reset user password',
        description: 'Verifies the reset code and updates the password.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  resetCode: { type: 'string' },
                  newPassword: { type: 'string' },
                  confirmNewPassword: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Password reset successfully' },
          400: {
            description: 'Invalid reset code or passwords do not match'
          },
          500: { description: 'Failed to reset password' }
        }
      }
    },
    '/users': {
      get: {
        tags: ['Auth'],
        summary: 'Get all users',
        description: 'Fetches a list of all users, excluding passwords.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Users fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/definitions/User' }
                }
              }
            }
          },
          500: { description: 'Failed to fetch users' }
        }
      },
      post: {
        tags: ['Auth'],
        summary: 'Create a new user',
        description: 'Creates a new user with the provided details.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/definitions/User' }
            }
          }
        },
        responses: {
          201: { description: 'User created successfully' },
          400: { description: 'Username already exists' },
          500: { description: 'Failed to create user' }
        }
      }
    },
    '/users/{id}': {
      get: {
        tags: ['Auth'],
        summary: 'Get a specific user',
        description: 'Fetches a user by ID.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'User fetched successfully',
            content: {
              'application/json': { schema: { $ref: '#/definitions/User' } }
            }
          },
          404: { description: 'User not found' },
          500: { description: 'Failed to fetch user' }
        }
      },
      put: {
        tags: ['Auth'],
        summary: 'Update a specific user',
        description: 'Updates a user by ID.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/definitions/User' }
            }
          }
        },
        responses: {
          200: { description: 'User updated successfully' },
          404: { description: 'User not found' },
          500: { description: 'Failed to update user' }
        }
      },
      delete: {
        tags: ['Auth'],
        summary: 'Delete a specific user',
        description: 'Deletes a user by ID.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'User deleted successfully' },
          404: { description: 'User not found' },
          500: { description: 'Failed to delete user' }
        }
      }
    },
    '/menus': {
      post: {
        tags: ['Menu'],
        summary: 'Create a new menu with items',
        description:
          'Creates a new menu with items. Only accessible by Managers.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  categoryId: { type: 'integer', example: 1 },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', example: 'Grilled Salmon' },
                        price: {
                          type: 'number',
                          format: 'float',
                          example: 24.99
                        },
                        categoryId: { type: 'integer', example: 1 },
                        isPopular: { type: 'boolean', example: true },
                        isAvailable: { type: 'boolean', example: true }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Menu created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    menu: { $ref: '#/definitions/Menu' },
                    menuItems: {
                      type: 'array',
                      items: { $ref: '#/definitions/MenuItem' }
                    }
                  }
                }
              }
            }
          },
          400: { description: 'Invalid input or category does not exist' },
          500: { description: 'Failed to create menu' }
        }
      },
      get: {
        tags: ['Menu'],
        summary: 'Get all menus with filters',
        description:
          'Fetches menus with optional filters (status, categoryId, isPopular).',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            description: 'Filter by menu status (Active, Pending, Rejected)',
            schema: { $ref: '#/definitions/MenuStatus' }
          },
          {
            name: 'categoryId',
            in: 'query',
            description: 'Filter by category ID',
            schema: { type: 'integer' }
          },
          {
            name: 'isPopular',
            in: 'query',
            description: 'Filter by popularity (true/false)',
            schema: { type: 'boolean' }
          }
        ],
        responses: {
          200: {
            description: 'Menus fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/definitions/Menu' }
                }
              }
            }
          },
          500: { description: 'Failed to fetch menus' }
        }
      }
    },
    '/menus/{id}/status': {
      patch: {
        tags: ['Menu'],
        summary: 'Approve or reject a menu',
        description:
          'Updates the status of a menu (Active or Rejected). Only accessible by Admins.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Menu ID',
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { $ref: '#/definitions/MenuStatus' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Menu status updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/definitions/Menu' }
              }
            }
          },
          400: { description: 'Invalid status or menu cannot be updated' },
          404: { description: 'Menu not found' },
          500: { description: 'Failed to update menu status' }
        }
      }
    },
    '/menus/{id}': {
      put: {
        tags: ['Menu'],
        summary: 'Update a menu',
        description:
          'Updates menu details (name, categoryId, isPopular). Only accessible by Managers.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Menu ID',
            schema: { type: 'integer' }
          }
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
                  isPopular: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Menu updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/definitions/Menu' }
              }
            }
          },
          404: { description: 'Menu not found' },
          500: { description: 'Failed to update menu' }
        }
      },
      delete: {
        tags: ['Menu'],
        summary: 'Delete a menu',
        description: 'Deletes a menu by ID. Only accessible by Managers.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Menu ID',
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Menu deleted successfully' },
          404: { description: 'Menu not found' },
          500: { description: 'Failed to delete menu' }
        }
      }
    },

    // Category Endpoints
    '/categories': {
      post: {
        tags: ['Category'],
        summary: 'Create a new category',
        description: 'Creates a new food category. Only accessible by Admins.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Desserts' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Category created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/definitions/FoodCategory' }
              }
            }
          },
          400: { description: 'Category name is required' },
          500: { description: 'Failed to create category' }
        }
      },
      get: {
        tags: ['Category'],
        summary: 'Get all categories',
        description: 'Fetches all food categories.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Categories fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/definitions/FoodCategory' }
                }
              }
            }
          },
          500: { description: 'Failed to fetch categories' }
        }
      }
    },
    '/categories/{id}': {
      put: {
        tags: ['Category'],
        summary: 'Update a category',
        description:
          'Updates a food category by ID. Only accessible by Admins.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Category ID',
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Sweet Treats' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Category updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/definitions/FoodCategory' }
              }
            }
          },
          400: { description: 'Category name is required' },
          404: { description: 'Category not found' },
          500: { description: 'Failed to update category' }
        }
      },
      delete: {
        tags: ['Category'],
        summary: 'Delete a category',
        description:
          'Deletes a food category by ID. Only accessible by Admins.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Category ID',
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Category deleted successfully' },
          404: { description: 'Category not found' },
          500: { description: 'Failed to delete category' }
        }
      }
    },

    '/orders': {
      post: {
        tags: ['Order'],
        summary: 'Create new order',
        description:
          'Creates a new order with items. Only accessible by Waiters.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  tableId: { type: 'integer', example: 1 },
                  specialInstructions: {
                    type: 'string',
                    example: 'No onions'
                  },
                  discount: { type: 'number', example: 100 },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        menuItemId: { type: 'integer', example: 1 },
                        quantity: { type: 'integer', example: 2 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Order created successfully' },
          400: { description: 'Invalid input' },
          500: { description: 'Failed to create order' }
        }
      },
      get: {
        tags: ['Order'],
        summary: 'Get orders with filters',
        description:
          'Fetches orders with optional filters (status, date range, waiter).',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: { $ref: '#/definitions/OrderStatus' }
          },
          {
            name: 'startDate',
            in: 'query',
            schema: { type: 'string', format: 'date' }
          },
          {
            name: 'endDate',
            in: 'query',
            schema: { type: 'string', format: 'date' }
          },
          { name: 'waiterId', in: 'query', schema: { type: 'integer' } }
        ],
        responses: {
          200: {
            description: 'Orders fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/definitions/Order' }
                }
              }
            }
          },
          500: { description: 'Failed to fetch orders' }
        }
      }
    },
    '/orders/{id}': {
      get: {
        tags: ['Order'],
        summary: 'Get order details',
        description: 'Fetches detailed information about a specific order.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Order fetched successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/definitions/Order' }
              }
            }
          },
          404: { description: 'Order not found' },
          500: { description: 'Failed to fetch order' }
        }
      }
    },
    '/reports': {
      post: {
        tags: ['Report'],
        summary: 'Generate a new report',
        description:
          'Generates a report for a specific period (Daily, Weekly, Monthly). Only accessible by Managers.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  period: { $ref: '#/definitions/ReportPeriod' },
                  submittedToId: {
                    type: 'integer',
                    description: 'Admin ID to whom the report is submitted'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Report generated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/definitions/Report' }
              }
            }
          },
          400: { description: 'Invalid input' },
          403: { description: 'Only managers can generate reports' },
          404: { description: 'Admin not found' },
          500: { description: 'Failed to generate report' }
        }
      },
      get: {
        tags: ['Report'],
        summary: 'Get all reports',
        description:
          'Fetches a list of all reports. Only accessible by Admins.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Reports fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/definitions/Report' }
                }
              }
            }
          },
          403: { description: 'Only admins can view reports' },
          500: { description: 'Failed to fetch reports' }
        }
      }
    },
    '/reports/{id}': {
      get: {
        tags: ['Report'],
        summary: 'Get report details',
        description:
          'Fetches detailed information about a specific report, including table-wise and order-wise breakdowns. Only accessible by Admins.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Report ID',
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Report details fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    period: { $ref: '#/definitions/ReportPeriod' },
                    total_orders: { type: 'integer' },
                    total_sales: { type: 'number', format: 'float' },
                    tables: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          tableNumber: { type: 'string' },
                          totalOrder: { type: 'integer' },
                          totalSales: { type: 'number', format: 'float' },
                          orders: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                timeSlot: { type: 'string' },
                                items: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    properties: {
                                      name: { type: 'string' },
                                      quantity: { type: 'integer' },
                                      price: {
                                        type: 'number',
                                        format: 'float'
                                      }
                                    }
                                  }
                                },
                                subtotal: { type: 'number', format: 'float' },
                                tax: { type: 'number', format: 'float' },
                                total: { type: 'number', format: 'float' }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: { description: 'Report not found' },
          500: { description: 'Failed to fetch report details' }
        }
      }
    },
    '/staff/on-duty': {
      get: {
        tags: ['Staff'],
        summary: 'Get all staff currently on duty',
        description:
          'Fetches a list of all staff members currently on duty, including their performance metrics (orders served, average time, earnings, etc.).',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'role',
            in: 'query',
            description: 'Filter staff by role (e.g., Waiter, Manager)',
            schema: { $ref: '#/definitions/Role' },
            required: false
          },
          {
            name: 'status',
            in: 'query',
            description: 'Filter staff by status (e.g., Active, OnBreak)',
            schema: { $ref: '#/definitions/StaffStatus' },
            required: false
          },
          {
            name: 'startDate',
            in: 'query',
            description: 'Filter by start date (e.g., 2023-10-01)',
            schema: { type: 'string', format: 'date' },
            required: false
          },
          {
            name: 'endDate',
            in: 'query',
            description: 'Filter by end date (e.g., 2023-10-31)',
            schema: { type: 'string', format: 'date' },
            required: false
          }
        ],
        responses: {
          200: {
            description: 'Staff on duty fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/definitions/StaffOnDuty' }
                }
              }
            }
          },
          500: {
            description: 'Failed to fetch staff on duty',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Failed to fetch staff on duty'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './routes/user.routes.js',
  './routes/auth.routes.js',
  './routes/menu.routes.js',
  './routes/category.routes.js',
  './routes/order.routes.js',
  './routes/staff.routes.js',
  './routes/report.routes.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);
