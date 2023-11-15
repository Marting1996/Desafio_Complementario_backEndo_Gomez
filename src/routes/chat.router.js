import { Router } from "express";
import { isAuthenticated } from "../middlewares/authenticate.middleware.js";

const router = Router()

router.get("/", async (req, res) => {
    res.render("index", {})
})

export default router