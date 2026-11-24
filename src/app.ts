import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import type { Config } from "./config.js";
import { createContainer } from "./container.js";
import { ROUTES } from "./shared/constants/routes.js";

export function createApp(config: Config) {
  const { routers } = createContainer(config);
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());

  app.use(ROUTES.POSTS, routers.postRouter);
  app.use(ROUTES.CATEGORIES, routers.categoryRouter);
  app.use(ROUTES.AUTH, routers.authRouter);
  app.use(ROUTES.COMMENTS, routers.commentsRouter);
  app.use(ROUTES.POSTCOMMENTS, routers.postCommentsRouter);

  return app;
}