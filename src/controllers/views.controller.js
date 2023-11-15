import { productService } from "../services/index.js";

export const index = async (req, res) => {
    res.render("index", {})
}
export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts()
        res.status(201).render("realTimeProducts", { products })
    } catch (error) {
        res.status(500).json({ message: "Ocurrio un error: ", error: error.message })
    }
}

export const getrealTimeProducts = async (req, res) => {
    res.render("realTimeProducts", {products, category, message})
}

export const createProduct = async (req, res) => {
    const product = req.body
    const newProduct = await productService.addProduct(product)
    res.send({status: "success", payload: newProduct})
}

/* export const Chat = async (req, res) => {
    res.render("chat", {})
} */