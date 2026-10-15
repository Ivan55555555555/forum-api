import { Router } from "express";
import type { createCategoryHandler } from "../handlers/category.js";

export function createCategoryRouter(handler: ReturnType<typeof createCategoryHandler>) {
    const router = Router();

    router.get("/", handler.getCategories);
    router.get("/:id", handler.getCategoryById);
    router.post("/", handler.createCategory);

    return router;
}