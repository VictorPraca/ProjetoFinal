const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../utils/authUtils'); 
const upload = require('../utils/multerConfig'); 

router.post('/register', upload.single('profilePicture'), authController.register); 
router.post('/login', authController.login);
router.get('/validate-token', protect, authController.validateToken);

module.exports = router;