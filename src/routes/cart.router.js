import { Router } from "express";
import { isAuthenticated } from "../middlewares/authenticate.middleware.js";
import {
    getAllCarts,
    createCart,
    getCartById,
    addProductToCart,
    deleteCart,
    removeProductFromCart,
    getUserCart,
    purchaseCart
} from "../controllers/carts.controller.js";
import { createTicket } from "../controllers/ticket.controller.js";

const router = Router();

router.get("/", getAllCarts);
router.post("/", createCart);
router.get("/user", isAuthenticated, getUserCart);
router.get("/:cid", isAuthenticated, getCartById);
router.post("/:cid/product/:pid", isAuthenticated, addProductToCart);
router.delete("/:cid", isAuthenticated, deleteCart);
router.delete("/:cid/products/:pid", isAuthenticated, removeProductFromCart); 
router.post("/user/purchase", isAuthenticated, purchaseCart, createTicket);

export default router; 
