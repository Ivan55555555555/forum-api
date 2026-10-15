import type { Request, Response } from "express";
import type { CategoryService } from "../../services/category.js";

export function createCategoryHandler(service: CategoryService) {
    async function getCategories(req: Request, res: Response) {
        const categories = await service.getCategories();
        res.status(200).json(categories);
    }

    async function getCategoryById(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ message: "id must be a positive integer" });
            return;
        }

        const category = await service.findCategory(id);

        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        res.status(200).json(category);
    }

    async function createCategory(req: Request, res: Response) {
        try {
            const { name } = req.body;

            if (typeof name !== "string" || !name.trim()) {
                res.status(422).json({ message: "Invalid name" });
                return;
            }

            const category = await service.createCategory(name.trim());
            res.status(201).json(category);
        } catch (error) {
            if (error instanceof Error && error.message === "CATEGORY_ALREADY_EXISTS") {
                res.status(409).json({ message: "Category with this name already exists" });
                return;
            }
            res.status(500).json({ message: "Server error" });
        }
    }

    return {
        getCategories,
        getCategoryById,
        createCategory,
    };
}