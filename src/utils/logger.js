import winston from "winston";

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
}

export const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        new winston.transports.File({
            filename: "./errors.log",
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.fatal(`${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}
