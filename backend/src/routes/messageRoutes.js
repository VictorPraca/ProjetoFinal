const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../utils/authUtils');

router.post('/', protect, messageController.sendMessage);
router.get('/:id', protect, messageController.getConversation); // ID do outro usuário para a conversa

module.exports = router;