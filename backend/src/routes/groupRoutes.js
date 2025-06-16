const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { protect } = require('../utils/authUtils');

// Rotas de Grupos/Comunidades
router.post('/', protect, groupController.createGroup); // Criar um novo grupo
router.get('/', protect, groupController.getAllGroups); // Listar todos os grupos
router.get('/:groupId', protect, groupController.getGroupDetails); // Obter detalhes de um grupo

// NOVO: Rota para obter postagens de um grupo específico
router.get('/:groupId/posts', protect, groupController.getGroupPosts); 

router.post('/join', protect, groupController.joinGroup); // Entrar em um grupo
router.post('/leave', protect, groupController.leaveGroup); // Sair de um grupo

// Rotas de Mensagens de Grupo
router.get('/:groupId/messages', protect, groupController.getGroupMessages); // Obter mensagens de um grupo
router.post('/:groupId/messages', protect, groupController.postGroupMessage); // Postar mensagem em um grupo
router.delete('/messages/:messageId', protect, groupController.deleteGroupMessage); // Apagar mensagem de grupo

module.exports = router;