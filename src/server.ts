import express from 'express';
import { db } from './prisma/db.js'; 

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

import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from './lib/jwt.js';

import cors from "cors";
import cookieParser from "cookie-parser";

import { createRequireAuth } from "./transport/middlewares/require-auth.js";

const app = express();
const PORT = 8000;
const HOST = 'localhost';

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());

const requireAuth = createRequireAuth(verifyAccessToken);

const userRepository = createUserRepository(db);

const userService = createAuthService(
    userRepository, 
    { hash: hashPassword, verify: verifyPassword }, 
    { signAccessToken, signRefreshToken },
    { verifyAccessToken, verifyRefreshToken }
);

const userHandler = createUserHandler(userService);

const userRouter = createUserRouter(userHandler, requireAuth);

const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);

const categoryRepository = createCategoryRepository(db);
const categoryService = createCategoryService(categoryRepository);
const categoryHandler = createCategoryHandler(categoryService);
const categoryRouter = createCategoryRouter(categoryHandler);

app.use('/auth', userRouter);          
app.use('/posts', postRouter);      
app.use('/categories', categoryRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Forum API with Dependency Injection!');
});

app.listen(PORT, HOST, () => {
  console.log(`DI Server is running on http://${HOST}:${PORT}`);
});