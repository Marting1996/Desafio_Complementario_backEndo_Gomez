import TicketDTO from "../DAO/DTO/ticket.dto.js";

export default class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAllTickets = async () => {
        return await this.dao.getAllTickets()
    }
    getTicketById = async (tid) => {
        return await this.dao.getTicketById(tid)
    }
    createTicket = async (ticketData) => {
        const newTicket = new TicketDTO(ticketData)
        return await this.dao.createTicket(newTicket)
    }
}