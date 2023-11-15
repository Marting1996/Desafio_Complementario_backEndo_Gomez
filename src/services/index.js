import { Products, Cart, Ticket, User } from "../DAO/factory.js"
import ProductRepository from "./product.repository.js"
import CartRepository from "./cart.repository.js"
import TicketRepository from "./ticket.repository.js"
import UserRepository from "./user.repository.js"

export const UserService = new UserRepository(new User())
export const TicketService = new TicketRepository(new Ticket())
export const productService = new ProductRepository(new Products())
export const cartService = new CartRepository(new Cart())
