import express from "express";
import config from "./config/index.js";
import sessionRouter from "./routes/session.js";
import usersRouter from "./routes/users.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import checkoutRouter from './routes/checkout.router.js';
import hbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";


// Passport y sesiones
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializedPassport from "./config/passport/config.js";

// Conexión a MongoDB con mongoose
import conectarDB from './config/db.js';

//  Variables de entorno
const { PORT, SECRET } = config;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = express();

// Conectar a la base de datos
conectarDB(); 

// Configuración de Handlebars
/* server.engine("handlebars", hbs.engine());
server.set("views", import.meta.dirname + "/views");
server.set("view engine", "handlebars"); */

server.engine("handlebars", hbs.engine({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials"),
}));
server.set("view engine", "handlebars");
server.set("views", path.join(__dirname, "views"));

// Middlewares generales
server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
server.use(
  session({
    secret: SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      sameSite: true,
      maxAge: 24 * 60 * 60 * 1000, // en milisegundos
    },
  })
);

// Inicialización de Passport
initializedPassport();
server.use(passport.initialize());
server.use(passport.session());

// Middleware que expone `user` a las vistas
server.use((req, res, next) => {
  const user = req.user || req.session.user || null;

  if (user) {
    const { password, ...safeUser } = user; // Eliminar campo password si está presente
    res.locals.user = safeUser;
  } else {
    res.locals.user = null;
  }

  next();
});
server.use((req, res, next) => {
  res.locals.errorMessage = req.session?.errorMessage || null;
  delete req.session.errorMessage;
  next();
});


// Rutas
server.use("/", viewsRouter);
server.use("/api/users", usersRouter);
server.use("/api/session", sessionRouter);
server.use('/api/products', productsRouter);
server.use('/api/checkout', checkoutRouter);
server.use('/api/carts', cartsRouter);

// Servidor
server.listen(PORT, () =>
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`)
);