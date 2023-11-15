import cartModel from "../DAO/mongo/models/cart.mongo.model.js";
import ProductMongo from "../DAO/mongo/product.mongo.js";
import { TicketService, cartService, productService } from "../services/index.js";
import { logger } from "../utils/logger.js";

export const getAllCarts = async (req, res) => {
    try {
        const carts = await cartService.getAllCarts();
        res.render("carts", { carts });
    } catch (error) {
        logger.debug("Error al obtener los carritos:", error);
        res.status(500).json({ error: "Error al obtener los carritos" });
    }
};
const updateTotalPrice = async (req, userId) => {
    try {
        const userCart = await cartModel.findOne({ user: userId });
        if (!userCart) {
            return;
        }
        const totalPrice = userCart.products.reduce((acc, product) => {
            logger.info(`Producto: ${product.title}, Precio: ${product.price}, Cantidad: ${product.quantity}`);
            return acc + product.price * product.quantity;
        }, 0);
        // logger.info("TotalPrice calculado:", totalPrice);
        await cartModel.updateOne({ user: userId }, { totalPrice });
    } catch (error) {
        logger.debug("Error al actualizar el totalPrice:", error);
    }
};

export const getUserCart = async (req, res) => {
    try {
        const uid = req.user._id;
        const userCart = await cartModel.findOne({ user: uid }).lean().exec();

        if (!userCart) {
            const newCart = await cartService.createCartForUser(uid);
            return res.render("cart", { cart: newCart });
        }
        //console.log(userCart);
        res.render("cart", { cart: userCart });
    } catch (error) {
        logger.debug("Error al obtener el carrito del usuario:", error);
        res.status(500).json({ error: "Error al obtener el carrito del usuario" });
    }
};

export const createCart = async (req, res) => {
    try {
        const result = await cartService.createCart();
        logger.info("Carrito creado");
        res.send(result);
    } catch (error) {
        logger.debug("Error:", error);
        res.status(500).json({ error: "Error al crear el carrito" });
    }
};

export const getCartById = async (req, res) => {
    try {
        const cid = req.params.cid;

        if (!cid) {
            const newCart = await Cart.createCart();
            res.json(newCart);
        } else {
            const cart = await Cart.getCartById(cid);
            res.render("carttt", { cart });
        }
    } catch (error) {
        logger.debug("Error:", error);
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { pid } = req.params;
        const { cid } = req.params;
        const { quantity } = req.body
        const product = await productService.getProductById(pid);
        const user = res.locals.user.email

        if (user === product.owner) {
            return res.status(400).json({ message: "No puedes agregar al carrito tu propio producto" })
        }

        if (!product || product.stock < quantity) {
            return res.status(404).json({ message: "Producto no disponible en suficiente cantidad" });
        }

        const result = await cartService.addProductToCart(cid, pid, quantity);
        await updateTotalPrice(req.user.user._id);

        if (result.error && result.error === "Producto no encontrado") {
            return res.status(404).json({ message: "Producto no encontrado en la base de datos" });
        }
        //logger.debug(result);
        res.status(200).json(result);
    } catch (error) {
        logger.debug(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartService.deleteCart(cartId);

        if (cart) {
            logger.info("El carrito se eliminó correctamente");
        } else {
            logger.info("Carrito a eliminar no encontrado");
        }
    } catch (error) {
        logger.debug(`Error al eliminar el carrito de la base de datos: ${error}`);
        res.status(500).json({ error: "Error al eliminar el carrito" });
    }
};

export const removeProductFromCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        const productIndex = cart.products.findIndex(
            (product) => product._id.toString() === pid
        );

        if (productIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }
        cart.products.splice(productIndex, 1);
        await updateTotalPrice(req.user._id);
        const updatedCart = await cart.save();

        res.json({ message: "Producto eliminado del carrito correctamente", cart: updatedCart });
    } catch (error) {
        logger.debug('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ message: "Error al eliminar el producto del carrito", error: error.message });;
    }
};
export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const userCart = await cartService.getUserCart(cid);
        if (userCart.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No hay productos en el carrito. No se puede realizar la compra.',
            });
        }
        const updatedCart = await cartService.cartPurchase(req.user._id);
        const tickets = await TicketService.getAllTickets();
        const nextCode = tickets.length + 1;
        const ticketData = {
            code: nextCode,
            purchase_datetime: new Date(),
            amount: userCart.totalPrice,
            purchaser: req.user.user.email,
        };
        await TicketService.createTicket(ticketData);
        return res.status(200).json({
            success: true,
            message: 'Compra realizada con éxito',
            cart: updatedCart
        });
    } catch (error) {
        logger.debug('Error al realizar la compra:', error);
        res.status(500).json({ success: false, message: 'Error al realizar la compra' });
    }
};

