const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); 
const { protect } = require('../utils/authUtils');
const upload = require('../utils/multerConfig');


router.post('/', protect, upload.single('media'), postController.createPost);
router.get('/', protect, postController.getPosts);

router.post('/interact/toggle-like-dislike', protect, postController.toggleLikeDislike);


router.post('/interact/comment', protect, postController.addComment);
router.get('/:postId/comments', protect, postController.getComments);


router.get('/:postId/interactions-summary', protect, postController.getPostInteractionsSummary);


module.exports = router;