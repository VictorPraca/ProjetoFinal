const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate } = require('../middlewares/authenticate'); // middleware de autenticação

router.post('/', authenticate, postController.createPost);
router.get('/', postController.getAllPosts);

// Rotas para comentários e reações podem ser criadas em arquivos separados

module.exports = router;