import { Router } from "express";
import { generateProduct } from "../utils.js";
import productModel from "../DAO/mongo/models/product.mongo.model.js"; 

const router = Router();

router.get("/generate", async (req, res) => {
    try {
        const products = [];
        for (let i = 0; i < 100; i++) {
            const productData = generateProduct();
            const product = new productModel(productData);
            await product.save();
            products.push(product);
        }

        res.status(201).send({ status: "success", payload: products });
    } catch (error) {
        logger.debug("Error al generar y guardar productos:", error);
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
});

export default router;
