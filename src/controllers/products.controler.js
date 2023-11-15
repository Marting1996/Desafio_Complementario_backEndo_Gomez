import CustomError from "../services/errors/custom_error.js";
import EErrors from "../services/errors/enums.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import { productService } from "../services/index.js"; 
import { logger } from "../utils/logger.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts()
        res.status(201).render("allProducts", { products })
    } catch (error) {
        res.status(500).json({ message: "Ocurrio un error: ", error: error.message })
    }
}
/* export const getProductsPaginate = async (req, res) => {
    const limit = parseInt(req.query?.limit || 5);
    const page = parseInt(req.query?.page || 1);
    const sort = parseInt(req.query?.sort || 1)
    const category = req.query?.category || null;
    try {
        const products = await productService.getProductsPaginate(limit, page, sort, category)
        if (products) {
            logger.info(products);
            res.status(201).render("home", { products })
        } else {
            res.status(400).json({ message: "Error al obtener los productos" })
        }
    } catch (error) {
        res.status(500).json({ message: "Ocurrio un error", error: error.message })
    }
} */

export const getProductById = async (req, res) => {
    const { pid } = req.params
    const product = await productService.getProductById(pid)
    //logger.info(product);
    try {
        if (product) {
            res.render("productDetail", { product })
        } else {
            res.status(500).json({ message: "Ocurrio un error: ", error: error.message })
        }
    } catch (error) {
        res.status(500).json({ message: "Ocurrio un error: ", error: error.message })
    }
}
export const addProductFront = async (req, res) => {
    res.render("form")
}

export const addProduct = async (req, res) => {
    const product = {
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category,
        thumbnail: req.body.thumbnail,
        owner: res.locals.user.email
    }
    if(!product.title || !product.price || !product.stock || !product.category) {
        return CustomError.createError({
            name: "User creation error",
            cause: generateProductErrorInfo(product),
            message: "Error trying to create user",
            code: EErrors.INVALID_TYPE_ERROR
        });
    }

    //logger.info("Product received:", product);

    try {
        const newProduct = await productService.addProduct(product);
        if (newProduct.success) {
            res.status(201).json({ success: true, message: "Producto agregado con éxito" });
        } else {
            res.status(400).json({ success: false, message: newProduct.message });
        }
    } catch (error) {
        logger.debug("Error al agregar el producto:", error);
        res.status(500).json({ success: false, message: "Ocurrió un error interno del servidor", error: error.message });
    }
};

/* export const deleteProduct = async (req, res) => {
    const pid = req.params.pid
    const product = await productService.deleteProduct(pid)
    try {
        if(product){
            res.status(201).send(product)
        } else {
            res.status(400).json({message: product.message})
        }  
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error", error: error})
    }
} */
export const deleteProduct = async (req, res) => {
    const pid = req.params.pid;
    const user = res.locals.user.email;
    const product = await productService.getProductById(pid);
    try {
        if (product.owner !== user) {
            logger.info("Solo el usuario que creó el producto puede eliminarlo")
            res.status(403).json({ message: "Solo el usuario que creó el producto puede eliminarlo" });
        } else {
            const deleteproduct = await productService.deleteProduct(pid);
            if (deleteproduct) {
                res.status(200).json(deleteproduct);
            } else {
                res.status(400).json({ message: "No se pudo eliminar el producto" });
            }
        }
    } catch (error) {
        console.error("Error al intentar eliminar el producto:", error);
        res.status(500).json({ message: "Ocurrió un error", error: error });
    }
};


export const updateProduct = async (req, res) => {
    const pid = req.params
    const product = await productService.updateProduct(pid, req.body)
    try {
        if(product){
            res.status(201).send(product)
        } else {
            res.status(400).json({message: product.message})
        }  
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error", error: error})
    }
    
}