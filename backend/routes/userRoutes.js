// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserTags,
  sendConnectionRequest,
  acceptConnection,
  searchUsersByTag
} = require('../controllers/userController');

router.get('/:id', getUserProfile);
router.put('/tags', auth, updateUserTags);
router.post('/connect', auth, sendConnectionRequest);
router.post('/accept', auth, acceptConnection);
router.get('/search/by-tag', searchUsersByTag);

module.exports = router;