const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../utils/authUtils'); // Middleware de proteção

// Rota para obter perfil de usuário por ID (se precisar, geralmente não usada diretamente no frontend)
router.get('/:id', protect, userController.getUserProfileById);

// NOVO: Rota para obter perfil de usuário por username (protegida)
// Ex: GET /api/users/username/victor
router.get('/username/:username', protect, userController.getUserProfileByUsername);

// NOVO: Rota para obter postagens de um usuário específico por username (protegida)
// Ex: GET /api/users/username/victor/posts
router.get('/username/:username/posts', protect, userController.getUserPosts);

// Rotas para conexão entre usuários
router.post('/connect', protect, userController.sendConnectionRequest);
router.post('/accept-connection', protect, userController.acceptConnectionRequest);

module.exports = router;