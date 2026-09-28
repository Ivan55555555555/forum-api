import express from 'express';
import postHandler from '../handlers/post.js';
const router = express.Router();

router.get('/', postHandler.getPosts);
router.get('/:id', postHandler.getPostById);
router.post('/', postHandler.createPost);

module.exports = router;
