import cartModel from "./models/cart.mongo.model.js";
import productModel from "./models/product.mongo.model.js";
import { logger } from "../../utils/logger.js";
import ticketModel from "./models/ticket.mongo.model.js";

export default class Cart {
    getAllCarts = async () => {
        try {
            return await cartModel.find().lean().exec()
        } catch (error) {
            logger.debug(error);
        }
    } 

    async createCart() {
        try {
            const result = await cartModel.create({ products: [] });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(cid) {
        try {
            const cart = await cartModel.findById(cid).lean().exec();
            return cart;
        } catch (error) {
            throw error;
        }
    }
    async addProductToCart(cid, pid, quantity) {
        try {
            const product = await productModel.findById(pid);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
    
            const cart = await cartModel.findById(cid);
            const existingProduct = cart.products.find((product) => product.product.toString() === pid);
    
            if (existingProduct) {
                // Actualizar la cantidad solamente, no agregar
                existingProduct.quantity = quantity;
            } else {
                // El producto no está en el carrito, agregarlo
                cart.products.push({
                    product: pid,
                    quantity,
                    title: product.title,
                    price: product.price,
                });
            }
    
            const result = await cart.save();
    
            const populatedCart = await cartModel
                .findById(cid)
                .populate("products.product")
                .lean()
                .exec();
    
            return populatedCart;
        } catch (error) {
            throw error;
        }
    }
    
    async getUserCart(userId) {
        try {
            const userCart = await cartModel.findOne({ user: userId }).lean().exec();
            return userCart;
        } catch (error) {
            throw error;
        }
    }

    async deleteCart(cid) {
        try {
            const cart = await cartModel.findByIdAndRemove(cid);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async removeProductFromCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
            const productIndex = cart.products.findIndex(
                (product) => product._id.toString() === pid
            );
    
            if (productIndex === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }
    
            cart.products.splice(productIndex, 1);
    
            const updatedCart = await cart.save();
    
            return updatedCart;
        } catch (error) {
            throw error;
        }
    }
    
    async checkStockAndReduce(productId, quantity) {
        try {
            const result = await productModel.updateOne(
                { _id: productId, stock: { $gte: quantity } },
                { $inc: { stock: -quantity } }
            );

            if (result.nModified === 0) {
                return { success: false, message: 'Stock insuficiente' };
            }

            return { success: true, message: 'Stock verificado y restado correctamente' };
        } catch (error) {
            logger.debug('Error al verificar el stock y restar la cantidad:', error);
            throw error;
        }
    }
    async cartPurchase(userId) {
        try {
            const userCart = await cartModel.findOne({ user: userId }).lean().exec();
            for (const product of userCart.products) {
                const stockCheckResult = await this.checkStockAndReduce(product.product, product.quantity);

                if (!stockCheckResult.success) {
                    throw new Error(`No se puede realizar la compra: ${stockCheckResult.message}`);
                }
            }
            const updatedCart = await cartModel.findOneAndUpdate(
                { _id: userCart._id },
                { $set: { products: [], totalPrice: 0 } },
                { new: true }
            ).populate("products.product").lean().exec();

            return updatedCart;
        } catch (error) {
            logger.debug('Error al realizar la compra:', error);
            throw error;
        }
    }
}
    

