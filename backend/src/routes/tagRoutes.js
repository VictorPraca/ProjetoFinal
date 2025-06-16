const express = require('express'); 
const router = express.Router();
const tagController = require('../controllers/tagController');
const { protect } = require('../utils/authUtils');


router.post('/', protect, tagController.addTagsToUser); 
router.get('/search', protect, tagController.searchUsersByTags); 
router.get('/', protect, tagController.getAllTags); 
router.get('/user/:username', protect, tagController.getUserTagsByUsername); 

module.exports = router; 