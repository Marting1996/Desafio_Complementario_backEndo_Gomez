import { Router } from "express";
import { isAuthenticated } from "../middlewares/authenticate.middleware.js";
import { createTicket } from "../controllers/ticket.controller.js";

const router = Router()

router.post("/create", isAuthenticated, createTicket)

export default router