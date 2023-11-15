import { TicketService, productService } from "../services/index.js";
import { cartService } from "../services/index.js";
import { logger } from "../utils/logger.js";

export const getAllTickets = async (req, res) => {
    try {
        const tickets = await TicketService.getAllTickets()
        res.render("tickets", { tickets });
    } catch (error) {
        res.status(500).json({ message: "Ocurrio un error: ", error: error.message })
    }
}

export const getTicketById = async (req, res) => {
    const { tid } = req.params
    const ticket = await TicketService.getTicketById(tid)
    try {
        if (ticket) {
            res.render("ticketDetail", { ticket })
        } else {
            res.status(500).json({ message: "Ocurrio un error: ", error: error.message })
        }
    } catch (error) {
        res.status(500).json({ message: "Ocurrio un error: ", error: error.message })
    }
}
export const createTicket = async (req, res) => {
    try {
        const { cid } = req.params;
        const userCart = await cartService.getUserCart(cid);

        for (const product of userCart.products) {
            const updatedProduct = await productService.updateProduct(
                product.product,
                { $inc: { stock: -product.quantity } }, 
                { new: true }
            );
            if (!updatedProduct || updatedProduct.stock < 0) {
                return res.status(500).json({ message: "Error al actualizar el stock del producto" });
            }
        }

        const tickets = await TicketService.getAllTickets();
        const nextCode = tickets.length + 1;
        const ticketData = {
            code: nextCode,
            purchase_datetime: new Date(),
            amount: userCart.totalPrice,
            purchaser: req.user.user.email,
        };

        //console.log(ticketData);
        await TicketService.createTicket(ticketData);
        res.status(200).send({ success: true, message: "ticket creado con éxito" });
    } catch (error) {
        logger.debug("Error al crear el ticket:", error);
        res.status(500).send({ success: false, message: "Error al crear el ticket", error: error.message });
    }
};

