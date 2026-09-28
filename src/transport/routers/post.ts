import { Router } from 'express';
import postHandler from '../handlers/post.js';

const router: Router = Router();

router.get('/', postHandler.getPosts);
router.get('/:id', postHandler.getPostById);
router.post('/', postHandler.createPost);

export default router;
