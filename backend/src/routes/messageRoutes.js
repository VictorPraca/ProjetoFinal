const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../utils/authUtils'); // Middleware de proteção

// Rotas de Mensagens Privadas
router.post('/', protect, messageController.sendMessage); // Enviar mensagem privada
router.get('/conversation/:otherUserId', protect, messageController.getConversation); // Obter conversa com outro usuário (passa ID)
router.get('/partners', protect, messageController.getConversationPartners); // Obter usuários com quem o logado conversou

module.exports = router; // <-- ESSA LINHA PRECISA ESTAR AQUI!
