const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../utils/authUtils'); 


router.post('/', protect, messageController.sendMessage);
router.get('/conversation/:otherUserId', protect, messageController.getConversation); 
router.get('/partners', protect, messageController.getConversationPartners); 

module.exports = router; 
