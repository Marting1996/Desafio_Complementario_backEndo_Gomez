import productModel from "./models/product.mongo.model.js"; 
import mongoose from "mongoose";
import { logger } from "../../utils/logger.js";

export default class ProductMongo {
    getAllProducts = async () => {
        try {
            return await productModel.find().lean().exec()
        } catch (error) {
            logger.debug("Error al obtener los productos" + error)
            return { message: "Error al obtener los productos" }
        }
    }
    /* getProductsPaginate = async(limit, page, sort, category) => {
        const filterCategory = category ? { category } : {};
        try {
            const products = await productModel.paginate(filterCategory, {
                page,
                limit,
                sort:{price: sort},
                lean: true,
            })
            products.nextLink = products.hasNextPage ? `/?page=${products.nextPage}&limit=${limit}&sort=${sort}` : "";
            products.prevLink = products.hasPrevPage ? `/?page=${products.prevPage}&limit=${limit}&sort=${sort}` : "";
            products.nextPagee = products.hasNextPage ? `/?page=${products.nextPage}&limit=${limit}&sort=${sort}` : "";
            products.prevPagee = products.hasPrevPage ? `/?page=${products.prevPage}&limit=${limit}&sort=${sort}` : "";
            return products
        
        } catch (error) {
            throw error
        }
    } */

    getProductById = async (pid) => {
        try {
            return await productModel.findById(pid).lean().exec()
        } catch (error) {
            logger.debug("Error al obtener el producto:", error)
            return { message: "Error al obtener el producto" }
        }
    }
    addProduct = async (product) => {
        try {
            const existingProduct = await productModel.findOne({ code: product.code });
            if (existingProduct) {
                return { success: false, message: "Ya existe un producto con ese código" };
            }
            const newProduct = new productModel(product);
            await newProduct.save()
    
            return { success: true, message: "El producto fue agregado con éxito" };
        } catch (error) {
            logger.debug("Error al agregar el producto", error)
            return { success: false, message: "Error al agregar el producto" };
        }
    }
    
    updateProduct = async (id, productUpdate) => {
        try {
            const newID = new mongoose.Types.ObjectId(id)
            const updateResponse = await productModel.updateOne(
                { _id: newID },
                { $set: productUpdate }
            );
            if (updateResponse.modifiedCount > 0) {
                return { success: true, message: "Precio del producto actualizado" };
            } else {
                return { success: false, message: "Producto no encontrado" };
            }
        } catch (error) {
            return {message: "Error al actualizar el producto"}
        }
    }
    deleteProduct = async (pid) => {
        try {
            return await productModel.deleteOne({ _id: pid })
        } catch (error) {
            return {message: "Error al eliminar el producto"}
        }
    }
    getProducts = async(limit) => {
        try {
            let products = await productsModel.find().lean().exec();
            if (limit !== undefined) {
              const parsedLimit = parseInt(limit);
              if (!isNaN(parsedLimit)) {
                if (parsedLimit <= products.length) {
                    products = products.slice(0, parsedLimit)
                    return products;
                }
                return {message: `La cantidad de productos es: ${products.length}`};
              }
            }
            return products
          } catch (error) {
           return {message: "Error al obtener los productos"}
          }
    }
}

