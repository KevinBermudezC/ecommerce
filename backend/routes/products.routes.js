import {Router} from "express";
import {createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct} from "../controllers/products.controller.js";
import categoryAndProductsMiddleware from "../middlewares/categoryAndProducts.middleware.js";

const productsRouter = Router();


productsRouter.get("/", getAllProducts);

productsRouter.get("/:id", getSingleProduct);

productsRouter.post("/create-product",categoryAndProductsMiddleware, createProduct);

productsRouter.put("/:id",categoryAndProductsMiddleware, updateProduct);

productsRouter.delete("/:id",categoryAndProductsMiddleware,deleteProduct);

export default productsRouter;