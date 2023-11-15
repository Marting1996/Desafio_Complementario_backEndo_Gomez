import dotenv from "dotenv"

dotenv.config()
export default {
    persistence: process.env.PERSISTENCE,
    port: process.env.PORT,
    URL: process.env.URL,
    dbName: process.env.DBNAME,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    CLIENTE_SECRET: process.env.CLIENTE_SECRET
}