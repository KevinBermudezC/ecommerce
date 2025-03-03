import {Router} from "express";
import {createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct,uploadProductImage} from "../controllers/products.controller.js";
import categoryAndProductsMiddleware from "../middlewares/categoryAndProducts.middleware.js";
import {productLimiter} from '../config/limiter.js'
import upload from '../middlewares/upload.middleware.js';


const productsRouter = Router();

// Log todas las peticiones a la ruta de productos
productsRouter.use((req, res, next) => {
  console.log(`Petición a productos: ${req.method} ${req.originalUrl}`);
  next();
});

productsRouter.get("/",productLimiter, getAllProducts);

productsRouter.get("/:id",productLimiter, getSingleProduct);

// Temporalmente quito el middleware de autenticación para pruebas
productsRouter.post("/", createProduct);

// Temporalmente quito el middleware de autenticación para pruebas
productsRouter.put("/:id", updateProduct);

// Temporalmente quito el middleware de autenticación para pruebas
productsRouter.delete("/:id", deleteProduct);

// Ruta para subir imagen de producto
productsRouter.post("/:id/image", upload.single('image'), uploadProductImage);

export default productsRouter;