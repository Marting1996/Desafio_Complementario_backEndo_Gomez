import { Router } from "express";

const router = Router()

router.get("/test", (req, res) => {
    req.logger.fatal("Test de error fatal")
    req.logger.error("Test de error 'error'")
    req.logger.warning("Test de error 'warning'")
    req.logger.info("Test de error 'info'")
    req.logger.http("Test de error 'http'")
    req.logger.debug("Test de error 'debug'")

    res.send("Logger testing")
})

export default router