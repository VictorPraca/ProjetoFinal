// src/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); // Importa o objeto postController
const { protect } = require('../utils/authUtils');
const upload = require('../utils/multerConfig');

// Rotas de Postagens
router.post('/', protect, upload.single('media'), postController.createPost);
router.get('/', protect, postController.getPosts);

// Rotas de Interações (Likes/Dislikes)
router.post('/interact/toggle-like-dislike', protect, postController.toggleLikeDislike);

// Rotas de Comentários
router.post('/interact/comment', protect, postController.addComment);
router.get('/:postId/comments', protect, postController.getComments);

// Nova rota para resumo de interações
router.get('/:postId/interactions-summary', protect, postController.getPostInteractionsSummary);

// --- MUITO IMPORTANTE: EXPORTAR O ROUTER ---
module.exports = router;