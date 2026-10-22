import type { Request, Response } from "express";
// import { db } from "../../../prisma/db.js"

// type Database = typeof db

export function createCategoryHandler(
    service: any,
    // database: Database
) {
    return {
        async getAllCategories(req: Request, res: Response) {
            try {
                const categories = await service.getCategories();
                res.status(200).json(categories);
            } catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        },
        async createCategory(req: Request, res: Response) {
            try {
                const { name } = req.body;

                if (!name || typeof name !== "string" || !name.trim()) {
                    res.status(422).json({ message: "Invalid category name" });
                    return;
                }

                const category = await service.createNewCategory(name.trim());

                if (!category) {
                    res.status(409).json({ message: "Category already exists" });
                    return;
                }

                res.status(201).json(category);
            } catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        },
        // async getCategoryById(id: number) {
        //     return await database.orm.public.Category
        //         .where({ id })
        //         .first();
        // }
    };
}