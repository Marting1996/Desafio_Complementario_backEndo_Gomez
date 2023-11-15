import { logger } from "../utils/logger.js";
export const isAdmin = (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
           // logger.info("Usuario no autenticado");
            return res.status(403).send('Acceso no autorizado.');
        }
        if (req.user && req.user.user && req.user.user.role === 'admin') {
            //logger.info("Middleware isAdmin ejecutado");
            //logger.info("Rol del usuario:", req.user.user.role);
            return next();
        }
        logger.info("Usuario no tiene el rol de administrador");
        return res.status(403).send('Solo el admin puede realizar esta acción.');
    } catch (error) {
        logger.debug("Error en middleware isAdmin:", error);
        return res.status(500).send("Error interno del servidor");
    }
};
