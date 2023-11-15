import config from "../config/config.js"
import mongoose from "mongoose"
import { logger } from "../utils/logger.js"

export let Ticket
export let Cart
export let Chat
export let Products
export let User

logger.info(`Persistence with ${config.persistence}`);

switch (config.persistence) {
    case "MONGO":
        mongoose.connect(config.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: config.dbName
        })
        const { default: CurrentMongo } = await import("./mongo/current.mongo.js")
        const { default: CartMongo } = await import("./mongo/cart.mongo.js")
        const { default: ProductMongo } = await import("./mongo/product.mongo.js")
        const { default: TicketMongo } = await import("./mongo/ticket.mongo.js")
        //const { default: ChatMongo } = await import("./mongo/chat.mongo.js")

        Ticket = TicketMongo
        User = CurrentMongo
        Cart = CartMongo
        Products = ProductMongo
            //Chat = ChatMongo

        break;

        case "FILE":
            try {
                const { default: CartManager } = await import("./file/cart.manager.js");
                const { default: ProductManager } = await import("./file/product.manager.js");
                Cart = CartManager;
                Products = ProductManager;
            } catch (error) {
                console.error("Error al importar implementación de FILE:", error);
            }
            break;
        
}