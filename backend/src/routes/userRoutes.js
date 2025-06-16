const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../utils/authUtils'); 

router.get('/:id', protect, userController.getUserProfileById);

router.get('/username/:username', protect, userController.getUserProfileByUsername);

router.get('/username/:username/posts', protect, userController.getUserPosts);


router.post('/connect', protect, userController.sendConnectionRequest);
router.post('/accept-connection', protect, userController.acceptConnectionRequest);

module.exports = router;