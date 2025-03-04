import upload from '../middlewares/upload.middleware.js';
import { Router } from "express";
import {uploadCategoryImage} from '../controllers/categories.controller.js'

const categoriesRouter = Router();

// Ruta para subir imagen de categoría
categoriesRouter.post("/:id/image", upload.single('image'), uploadCategoryImage); 