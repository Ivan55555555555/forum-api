import express from 'express';
import { db } from './prisma/db.js'; 

import type { Post } from './domain/post/repository.js';

import { createPostRepository } from './repositories/post.js';
import { createPostService } from './services/post.js';
import { createPostHandler } from './transport/handlers/post.js';
import { createPostRouter } from './transport/routers/post.js';

import { createCategoryRepository } from './repositories/category.js';
import { createCategoryService } from './services/category.js';
import { createCategoryHandler } from './transport/handlers/category.js';
import { createCategoryRouter } from './transport/routers/category.js';

const app = express();
const PORT = 8000;
const HOST = 'localhost';

app.use(express.json());

const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);

const categoryRepository = createCategoryRepository(db);
const categoryService = createCategoryService(categoryRepository);
const categoryHandler = createCategoryHandler(categoryService);
const categoryRouter = createCategoryRouter(categoryHandler);

app.use('/posts', postRouter);
app.use('/categories', categoryRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Forum API with Dependency Injection!');
});

app.listen(PORT, () => {
  console.log(`DI Server is running on http://${HOST}:${PORT}`);
});