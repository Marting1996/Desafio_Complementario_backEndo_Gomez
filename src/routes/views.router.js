import { Router } from "express";
import { getrealTimeProducts, createProduct, getAllProducts } from "../controllers/views.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router()

router.get("/", getAllProducts)
router.get("/realtimeproducts", getAllProducts)
router.post("/realtimeproducts", isAdmin, createProduct)

export default router