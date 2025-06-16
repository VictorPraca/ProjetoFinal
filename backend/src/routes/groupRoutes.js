const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { protect } = require('../utils/authUtils');

router.post('/', protect, groupController.createGroup); 
router.get('/', protect, groupController.getAllGroups); 
router.get('/:groupId', protect, groupController.getGroupDetails); 


router.get('/:groupId/posts', protect, groupController.getGroupPosts); 

router.post('/join', protect, groupController.joinGroup); 
router.post('/leave', protect, groupController.leaveGroup); 


router.get('/:groupId/messages', protect, groupController.getGroupMessages); 
router.post('/:groupId/messages', protect, groupController.postGroupMessage); 
router.delete('/messages/:messageId', protect, groupController.deleteGroupMessage); 

module.exports = router;