import { Router } from "express";
import {
     addProductFront,
     getAllProducts,
     //getProductsPaginate, 
     addProduct,
     getProductById,
     updateProduct,
     deleteProduct
} from "../controllers/products.controler.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { isAuthenticated } from "../middlewares/authenticate.middleware.js";
import { isPremium } from "../middlewares/isPremium.middleware.js";


const productRouter = Router();

//productRouter.get("/", getPaginatedProducts);
productRouter.get("/", getAllProducts);
productRouter.get("/new", addProductFront);
productRouter.post("/new",isAuthenticated, (isAdmin || isPremium), addProduct);
productRouter.get("/:pid", getProductById);
productRouter.put("/:pid",isAuthenticated, isAdmin, updateProduct);
productRouter.delete("/:pid",isAuthenticated, isPremium, deleteProduct);


export default productRouter 