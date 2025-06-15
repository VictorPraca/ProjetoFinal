const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { protect } = require('../utils/authUtils');

router.post('/', protect, groupController.createGroup);
router.post('/join', protect, groupController.joinGroup);
router.get('/:id/messages', protect, groupController.getGroupMessages);
router.post('/:id/messages', protect, groupController.postGroupMessage);
router.delete('/messages/:messageId', protect, groupController.deleteGroupMessage); // Rota para apagar mensagens de grupo

module.exports = router;