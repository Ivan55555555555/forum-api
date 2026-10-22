import { Router } from "express";
import type { createCategoryHandler } from "../handlers/category/category.ts";

export function createCategoryRouter(handler: ReturnType<typeof createCategoryHandler>) {
    const router = Router();

    router.get("/", handler.getAllCategories);
    router.get("/:id", handler.getCategoryById);
    router.post("/", handler.createCategory);

    return router;
}