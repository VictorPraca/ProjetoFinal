const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { protect } = require('../utils/authUtils');

router.post('/', protect, tagController.addTagsToUser);
router.get('/search', protect, tagController.searchUsersByTags);
router.get('/', protect, tagController.getAllTags); // Para buscar todas as tags existentes

module.exports = router;