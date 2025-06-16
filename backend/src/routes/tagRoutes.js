const express = require('express'); // <-- ESSA LINHA PRECISA ESTAR AQUI
const router = express.Router();
const tagController = require('../controllers/tagController');
const { protect } = require('../utils/authUtils');

// Rotas de Tags e Interesses
router.post('/', protect, tagController.addTagsToUser); // Adicionar/Atualizar tags do usuário logado
router.get('/search', protect, tagController.searchUsersByTags); // Buscar usuários por tags
router.get('/', protect, tagController.getAllTags); // Obter todas as tags existentes
router.get('/user/:username', protect, tagController.getUserTagsByUsername); // Obter tags de um usuário específico por username

module.exports = router; // <-- EXPORTAÇÃO CRÍTICA DO ROUTER
