import { logger } from "../utils/logger.js"
export const isPremium = (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            // logger.info("Usuario no autenticado");
             return res.status(403).send('Acceso no autorizado.');
         }
        if(req.user && req.user.user && req.user.user.role === "premium") {
            return next()
        }
        logger.info("El usuario no tiene el rol Premium 💎")
        return res.status(403).send("Solo un usuario premium puede realizar esta accion")
    } catch (error) {
        logger.info("Error en el middleware isPremium", error)
        res.status(500).send("Error interno del servidor")
    }
}