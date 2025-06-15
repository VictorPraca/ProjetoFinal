const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../utils/authUtils');

router.get('/:id', protect, userController.getUserProfile);
router.post('/connect', protect, userController.sendConnectionRequest);
router.post('/accept-connection', protect, userController.acceptConnectionRequest);

module.exports = router;