import express from 'express';

import { createPostRepository } from './domain/post/repository.js';
import { createPostService } from './services/post.js';
import { createPostHandler } from './transport/handlers/post.js';
import { createPostRouter } from './transport/routers/post.js';

const app = express();
const PORT = 3000;
const HOST = 'localhost';

app.use(express.json());

const postRepository = createPostRepository();
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);

app.use('/posts', postRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Forum API with Dependency Injection!');
});

app.listen(PORT, () => {
  console.log(`DI Server is running on http://${HOST}:${PORT}`);
});
