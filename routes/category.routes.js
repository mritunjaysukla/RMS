const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');
const categoryController = require('../controllers/category.controller');
const router = express.Router();

// Category Routes
router.post(
  '/categories',
  auth,
  validateRole(['Admin']),
  categoryController.createCategory
);
router.get('/categories', auth, categoryController.getAllCategories);
router.put(
  '/categories/:id',
  auth,
  validateRole(['Admin']),
  categoryController.updateCategory
);
router.delete(
  '/categories/:id',
  auth,
  validateRole(['Admin']),
  categoryController.deleteCategory
);
