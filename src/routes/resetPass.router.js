import { Router } from "express";
import { renderResetPass, resetPass, renderForgotPass, requestPassReset } from "../controllers/forgotPass.controller.js";

const router = Router()

router.get("/reset-pass/:resetToken", renderResetPass)
router.post("/reset-pass", resetPass)
router.get("/forgot-pass", renderForgotPass)
router.post("/forgot-pass", requestPassReset)

export default router