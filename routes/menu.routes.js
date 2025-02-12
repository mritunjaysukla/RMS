const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');
const menuController = require('../controllers/menu.controller');

const router = express.Router();

router.get('/menus', menuController.getMenus);

router.post(
  '/menus',
  auth,
  validateRole(['Manager']),
  menuController.createMenuWithItems
);

router.patch(
  '/menus/:id',
  auth,
  validateRole(['Admin']),
  menuController.updateMenu
);

router.put(
  '/menus/:id/status',
  auth,
  validateRole(['Admin']),
  menuController.updateMenuStatus
);

router.delete(
  '/menus/:id',
  auth,
  validateRole(['Admin']),
  menuController.deleteMenu
);
module.exports = router;
