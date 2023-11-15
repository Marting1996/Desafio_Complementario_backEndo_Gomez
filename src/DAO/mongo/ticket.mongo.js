import ticketModel from "./models/ticket.mongo.model.js";
import { logger } from "../../utils/logger.js";

export default class TicketMongo {
    getAllTickets = async () => {
        try {
            return await ticketModel.find().lean().exec()
        } catch (error) {
            return { message: "Error al obtener los tickets" }
        }
    }

    getTicketById = async (id) => {
        try {
            const ticket = await ticketModel.findById(id);
            return { success: true, content: ticket, message: "Ticket encontrado" };
        } catch (error) {
            return { success: false, message: "Error al obtener el ticket", error };
        }
    }
    createTicket = async (ticketData) => {
        //logger.info('Inicio del servicio de creación de ticket');
        //logger.info('TicketData recibido:', ticketData);
        try {
            const newTicket = await ticketModel.create(ticketData);
            //logger.info('Nuevo ticket creado:', newTicket);
            return { success: true, content: newTicket, message: "Ticket creado con éxito" };
        } catch (error) {
            logger.debug('Error al crear el ticket:', error);
            return { success: false, message: "Ocurrió un error al crear el ticket", error };
        }
    };
    
    
}