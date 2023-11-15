import fs from "fs";
import { logger } from "../../utils/logger";

class CartManager {
  constructor(filename) {
    this.filename = filename;
    this.format = "utf-8";
    this.path = "./carts.json";
    this.carts = [];
    this.initialize();
  }

  initialize() {
    try {
      if (fs.existsSync(this.path)) {
        const data = fs.readFileSync(this.path, this.format);
        this.carts = JSON.parse(data);
      } else {
        fs.writeFileSync(this.path, JSON.stringify([]));
      }
    } catch (error) {
      logger.debug(`Error: ${error}`);
    }
  }

  getNextId = (carts) => {
    return carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
  };

  async addProductToCart(cid, pid) {
    try {
      const cartIndex = this.carts.findIndex((cart) => cart.id === cid);
      if (cartIndex !== -1) {
        const cart = this.carts[cartIndex];
        const productIndex = cart.products.indexOf(pid);
        if (productIndex !== -1) {
          cart.quantity[productIndex] += 1;
        } else {
          cart.products.push(pid);
          cart.quantity.push(1);
        }
        await this.updateCart(cid, cart);
        logger.info("Producto agregado al carrito correctamente");
      } else {
        logger.info("Carrito no encontrado");
      }
    } catch (error) {
      logger.debug(`Error: ${error}`);
    }
  }
    
  getCarts = async () => {
    try {
      const data = await fs.promises.readFile(this.path, this.format);
      const dataObj = JSON.parse(data);
      return dataObj;
    } catch (error) {
      logger.debug(`Error: ${error}`);
      return [];
    }
  };

  async getCartById(cid) {
    try {
      logger.info("carritos:", this.carts)
      const cart = this.carts.find((cart) => cart.id === cid);
      if (cart) {
        return cart;
      } else {               
        logger.info("Cart not found");
        return null;
      }
    } catch (error) {
      logger.debug(`Error: ${error}`);
      return null;
    }
  }

  async createCart(id, products) {
    try {
      const newCartId = this.getNextId(this.carts);
      const newCart = { id: newCartId, products: [], quantity: [] };
      this.carts.push(newCart);
      await this.writeCartsToFile();
      return newCart;
    } catch (error) {
      logger.debug("Error al crear el carrito:", error);
      throw new Error("Error al crear el carrito");
    }
  }

  async updateCart(cid, updatedCart) {
    try {
      const cartIndex = this.carts.findIndex((cart) => cart.id === cid);
      if (cartIndex !== -1) {
        this.carts[cartIndex] = updatedCart;
        await this.writeCartsToFile();
        logger.info("Carrito actualizado correctamente");
      } else {
        logger.info("Carrito no encontrado");
      }
    } catch (error) {
      logger.debug(`Error: ${error}`);
    }
  }

  writeCartsToFile() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts), this.format);
      logger.info("Archivo de carritos actualizado correctamente");
    } catch (error) {
      logger.debug(`Error al escribir en el archivo de carritos: ${error}`);
    }
  }
  
}

export default CartManager;
