import express from 'express';
import { db } from './prisma/db.js'; 

import { postsRouter } from './transport/routers/post.js';

import { createPostRepository } from './repositories/post.js';
import { createPostService } from './services/post/post.js';
import { createPostHandler } from './transport/handlers/post/post.js';
import { createPostRouter } from './transport/routers/post.js';

import { createCategoryRepository } from './repositories/category.js';
import { createCategoryService } from './services/category/category.js';
import { createCategoryHandler } from './transport/handlers/category/category.js';
import { createCategoryRouter } from './transport/routers/category.js';

import { createUserRepository } from './repositories/user.js';
import { createAuthService } from './services/user/user.js';
import { createUserHandler } from './transport/handlers/user/user.js';
import { createUserRouter } from './transport/routers/auth.js';
import { hashPassword, verifyPassword } from './lib/password.js';
import { signAccessToken } from './lib/jwt.js';

const app = express();
const PORT = 8000;
const HOST = 'localhost';

app.use(express.json());

const userRepository = createUserRepository(db);
const userService = createAuthService(
    userRepository, 
    { hash: hashPassword, verify: verifyPassword }, 
    { signAccessToken }
);
const userHandler = createUserHandler(userService);
const userRouter = createUserRouter(userHandler);

const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);

const categoryRepository = createCategoryRepository(db);
const categoryService = createCategoryService(categoryRepository);
const categoryHandler = createCategoryHandler(categoryService);
const categoryRouter = createCategoryRouter(categoryHandler);



app.use('/auth', userRouter);          
app.use('/posts', postsRouter);         
app.use('/categories', categoryRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Forum API with Dependency Injection!');
});

app.listen(PORT, HOST, () => {
  console.log(`DI Server is running on http://${HOST}:${PORT}`);
});