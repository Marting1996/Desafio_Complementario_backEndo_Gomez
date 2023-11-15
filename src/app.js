import express from "express";
import session from "express-session";
//import MongoStore from "connect-mongo";
import handlebars from "express-handlebars"
import mongoose from "mongoose";
import { Server } from "socket.io";
import passport from "passport";
import cookieParser from "cookie-parser"
import __dirname from "./utils.js"
import initializePassport from "./config/passport.config.js"; 
import viewsRouter from "./routes/views.router.js"
import productsRouter from "./routes/product.router.js"
import ticketsRouter from "./routes/ticket.router.js"
import cartsRouter from "./routes/cart.router.js"
import jwtRouter from "./routes/current.router.js"
import chatRouter from "./routes/chat.router.js"
import resetPassRouter from "./routes/resetPass.router.js"
import loggerTestRouter from "./routes/logger.router.js"
import mokingProductsRouter from "./routes/mokingproducts.router.js"
import productModel from "./DAO/mongo/models/product.mongo.model.js";
import chatModel from "./DAO/mongo/models/chat.models.js"
import errorHandler from "./middlewares/errors.js"
import { addLogger, logger } from "./utils/logger.js";

//express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = app.listen(8080)
const io = new Server(httpServer)

//Configurar handlebars
app.engine("handlebars", handlebars.engine(), );
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// logger
app.use(addLogger)

app.use(cookieParser())
app.use(session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true
}))

//passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Middleware de Passport
app.use((req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        //console.log("Authentication result:", err, user);
        if (err || !user) {
            res.locals.user = null;
        } else {
            res.locals.user = user.user; 
        }
        next();
    })(req, res, next);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

//Rutas
app.use("/static", express.static(__dirname + "/public"))
app.use("/", viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/ticket", ticketsRouter)
//app.use("/api/session", sessionRouter)
app.use("/chat", chatRouter )
app.use("/api/current", jwtRouter)
app.use("/loggerTest", loggerTestRouter)
app.use("/resetPass", resetPassRouter)

//faker
app.use("/mokingproducts", mokingProductsRouter)
//error
app.use(errorHandler)

mongoose.set("strictQuery", false)
const run = async () => {
    const products = await productModel.aggregate([
        //Filtrar por criterio
        {$match: {category: "frutas"}},
        //Ordenar por cantidad
        {$sort:{stock: -1}},
        //guardar resultado
        { $group: {
            _id: 1,
            products: {$push: "$$ROOT"}
        }},
        //Generamos un id
        {$project: {
            "_id": 0,
            products: "$products"
        }},
        //Agregamos a la coleccion
         /* {$merge: {
            into: "carts"
        }}   */
    ])
    //console.log(JSON.stringify(products, null, 2, "/t"));
}

io.on("connection", async (socket) => {
    console.log("New client connected");
    try {
        const messages = await chatModel.find().lean().exec();
        socket.emit("logs", messages);
    } catch (error) {
        console.error("Error al cargar los mensajes del chat:", error);
    }
    socket.on("message", async (data) => {
        try {
            const newMessage = new chatModel(data);
            await newMessage.save();
            io.emit("logs", [data]);
        } catch (error) {
            console.error("Error al guardar el mensaje en la base de datos:", error);
        }
    });
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
    socket.on("new-product", async data => {
        try {
            const productExists = await productModel.exists({ code: data.code });

            if (productExists) {
                console.log("El producto ya existe");
                socket.emit("product-exists", { error: "El producto ya existe" });
            } else {
                const productGenerated = new productModel(data);
                await productGenerated.save();

                console.log("Producto agregado a la BD correctamente");
                socket.emit("product-added", { message: "Producto agregado a la BD correctamente" });
                const products_realtime = await productModel.find().lean().exec();
                io.emit("reload-table", products_realtime);
            }
        } catch (error) {
            console.log("Error al agregar el producto a la BD:", error);
            socket.emit("product-error", { error: "Error al agregar el producto" });
        }
    });

    socket.on("delete-product", async (productId) => {
        try {
            const validProductId = new mongoose.Types.ObjectId(productId);
            const deletedProduct = await productModel.findByIdAndRemove(validProductId);
            const products_realtime = await productModel.find().lean().exec();
            io.emit("reload-table", products_realtime);
    
            console.log("Producto eliminado correctamente:", deletedProduct);
        } catch (error) {
            console.log("Error al eliminar el producto de la base de datos:", error);
        }
    });
    
});

export default app;

