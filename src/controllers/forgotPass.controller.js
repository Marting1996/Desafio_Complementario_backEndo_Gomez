import nodemailer from "nodemailer"
import crypto from "crypto"
import { UserService } from "../services/index.js"
import { logger } from "../utils/logger.js"
import { createHash } from "../utils.js"
import bcrypt from "bcrypt"

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "marting.091996@gmail.com",
        pass: "vucs aueg nezb vozw"
    }
})

export const renderForgotPass = async (req, res) => {
    res.render("forgot-pass")
}

export const requestPassReset = async (req, res) => {
    const { email } = req.body
    logger.info("email:", email)
    try {
        const user = await UserService.getUserByEmail(email)

        if (!user) {
            return res.render("forgot-pass", { error: "Email no registrado" })
        }

        const resetToken = crypto.randomBytes(32).toString("hex")
        const resetTokenExpiry = Date.now() + 3000000

        logger.info(resetToken, resetTokenExpiry)

        user.resetPassToken = resetToken
        user.resetPassExpiry = resetTokenExpiry

        await UserService.updateUser(user, {
            resetPassToken: resetToken,
            resetPassExpiry: resetTokenExpiry
        });
        logger.info("User:", user)

        const resetLink = `${req.protocol}://${req.get('host')}/resetPass/reset-pass/${resetToken}`
        /* await transporter.sendMail({
            to: email,
            subject: "Restablecimiento de la contraseña",
            html: `Para restablecer la contraseña, haz click en el siguiente enlace: <a href="${resetLink}">Restablecer Contraseña</a>`
        }) */

        return res.render("forgot-pass", { success: "Se ha enviado un enlace a tu email para restablecer la contraseña" })
    } catch (error) {
        res.render("forgot-pass", { error: "Error al procesar la solicitud" })
    }
}

export const renderResetPass = async (req, res) => {
    const { resetToken } = req.params;

    try {
        const user = await UserService.getUserToken(resetToken);
        if (!user) {
            return res.status(400).json({ status: "error", error: "El enlace no es válido o ha expirado" });
        }
        if (user.resetPassExpiry <= Date.now()) {
            return res.status(400).json({ status: "error", error: "El enlace ha expirado" });
        }
        res.render("reset-pass", { resetToken });
    } catch (error) {
        console.error("Error en renderResetPass:", error);
        return res.status(500).json({ status: "error", error: "Error al procesar la solicitud" });
    }
}


export const resetPass = async (req, res) => {
    const { resetToken, newPass } = req.body

    try {
        const user = await UserService.getUserToken(resetToken);
        if (!user) {
            console.log("El usuario no existe");
            return res.render("reset-pass", { error: "El enlace no es valido o expiro" })
        }
        const passwortMatch = await bcrypt.compare(newPass, user.password)

        if (passwortMatch) {
            logger.info("Las contraseñas son iguales")
            return res.render("reset-pass", { error: "La nueva contraseña no puede ser igual a la anterior" })
        }
        const newPasswordHash = createHash(newPass)

        const data = {
            password: newPasswordHash,
            resetPassToken: null,
            resetPassExpiry: null
        };
        await UserService.updateUser(user._id, data)
        return res.render("reset-pass", { success: "Contraseña restablecida" })
    } catch (error) {
        console.error("Error:", error);
        return res.render("reset-pass", { error: "Error al procesar la solicitud" })
    }
}
