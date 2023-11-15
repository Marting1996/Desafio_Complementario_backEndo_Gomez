import CartDTO from "../DAO/DTO/cart.dto.js"; 

export default class CartRepository {
    constructor(dao) {
        //logger.info("dao received:", dao);
        this.dao = dao;
       // logger.info(this.dao)
    }

    async getAllCarts() {
        try {
            return await this.dao.getAllCarts();
        } catch (error) {
            throw error;
        }
    }

    async createCart(cart) {
        try {
            const newCart = new CartDTO(cart)
            return await this.dao.createCart(newCart);
        } catch (error) {
            throw error;
        }
    }

    async getCartById(cid) {
        try {
            return await this.dao.getCartById(cid);
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cid, pid, quantity) {
        try {
            return await this.dao.addProductToCart(cid, pid, quantity);
        } catch (error) {
            throw error;
        }
    }

    async deleteCart(cid) {
        try {
            return await this.dao.deleteCart(cid);
        } catch (error) {
            throw error;
        }
    }

    async removeProductFromCart(cid, pid) {
        try {
            return await this.dao.removeProductFromCart(cid, pid);
        } catch (error) {
            throw error;
        }
    }

    async getUserCart (uid, pid, cid) {
        try {
            return await this.dao.getUserCart(uid, pid, cid)
        } catch (error) {
            throw error
        }
    }
    async cartPurchase () {
        try {
            return await this.dao.cartPurchase()
        } catch (error) {
            throw error
        }
    }
} 
