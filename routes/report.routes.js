const express = require('express');
const router = express.Router();
const { submitReport } = require('../controllers/reportController');
const auth = require('../middlewares/auth.Middleware');
const validateRole = require('../middlewares/role.Middleware');

router.post('/', auth, validateRole(['MANAGER']), submitReport);
module.exports = router;
