import { Router } from "express";
import { createCategory } from "../controllers/category.controllers.js";
import categoryAndProductsMiddleware from "../middlewares/categoryAndProducts.middleware.js";

const categoryRouter = Router();

categoryRouter.post("/create-category",categoryAndProductsMiddleware, createCategory);

categoryRouter.get("/categories", )

export default categoryRouter;