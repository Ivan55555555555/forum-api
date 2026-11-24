import type { Config } from "./config.js";
import { createTokenService } from "./lib/jwt.js";
import { createPasswordHasher } from "./lib/password.js";
import { createDb } from "./prisma/db.js";
import { createCategoryRepository } from "./repositories/category.js";
import { createCommentRepository } from "./repositories/comment.js";
import { createPostRepository } from "./repositories/post.js";
import { createRefreshSessionRepository } from "./repositories/refresh-session.js";
import { createUserRepository } from "./repositories/user.js";
import { createCategoryService } from "./services/category/category.js";
import { createCommentService } from "./services/comment/comment.js";
import { createPostService } from "./services/post/post.js";
import { createAuthService } from "./services/user/user.js";
import { createCategoryHandler } from "./transport/handlers/category/category.js";
import { createCommentHandler } from "./transport/handlers/comment/comment.js";
import { createPostHandler } from "./transport/handlers/post/post.js";
import { createUserHandler } from "./transport/handlers/user/user.js";
import { createRequireAuth } from "./transport/middlewares/require-auth.js";
import { createUserRouter } from "./transport/routers/auth.js";
import { createCategoryRouter } from "./transport/routers/category.js";
import { createCommentsRouter } from "./transport/routers/comments.js";
import { createPostCommentsRouter } from "./transport/routers/post-comments.js";
import { createPostRouter } from "./transport/routers/post.js";

export function createContainer(config: Config) {
  const db = createDb(config.databaseUrl);

  const users = createUserRepository(db);
  const sessions = createRefreshSessionRepository(db);
  const passwords = createPasswordHasher(config.passwordPepper);
  const tokens = createTokenService(config.jwt);
  const auth = createAuthService({ users, sessions, passwords, tokens });
  const requireAuth = createRequireAuth(tokens);
  
  
  
  const postRouter = createPostRouter(createPostHandler(createPostService(createPostRepository(db))));
  const categoryRouter = createCategoryRouter(createCategoryHandler(createCategoryService(createCategoryRepository(db))));
  const authRouter = createUserRouter(createUserHandler(auth), requireAuth);
  const commentsRouter = createCommentsRouter(createCommentHandler(createCommentService(createCommentRepository(db))), requireAuth);
  const postCommentsRouter = createPostCommentsRouter(createCommentHandler(createCommentService(createCommentRepository(db))), requireAuth);
  
  
  

  return {
    routers: {
      postRouter,
      categoryRouter,
      authRouter,
      commentsRouter,
      postCommentsRouter
    },
  };

  
}