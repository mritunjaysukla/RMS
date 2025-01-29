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
          400: { description: 'Invalid reset code or passwords do not match' },
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
                schema: { type: 'array', items: { $ref: '#/definitions/User' } }
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
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/user.routes.js', './routes/auth.routes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
