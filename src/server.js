import express from "express";
import { createServer } from "http"; // Importa createServer de http
import { Server } from "socket.io"; // Importa Server de socket.io
import config from "./config/index.js";
import sessionRouter from "./routes/session.router.js";
import usersRouter from "./routes/users.router.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from './routes/products.js';
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

// Variables de entorno
const { PORT, SECRET } = config;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Renombramos a 'app' para claridad
const httpServer = createServer(app); // Creamos servidor HTTP
const io = new Server(httpServer); // Inicializamos Socket.IO

// Conectar a la base de datos
conectarDB(); 

// Configuración de Handlebars
app.engine("handlebars", hbs.engine({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials"),
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares generales
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(
  session({
    secret: SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      sameSite: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Inicialización de Passport
initializedPassport();
app.use(passport.initialize());
app.use(passport.session());

// Middleware que expone `user` a las vistas
app.use((req, res, next) => {
  const user = req.user || req.session.user || null;
  if (user) {
    const { password, ...safeUser } = user;
    res.locals.user = safeUser;
  } else {
    res.locals.user = null;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.errorMessage = req.session?.errorMessage || null;
  delete req.session.errorMessage;
  next();
});

// Compartir la instancia de io con las rutas
app.locals.io = io;

// Rutas
app.use("/", viewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/session", sessionRouter);
app.use('/api/products', productsRouter);

// Configuración de Socket.IO (opcional: eventos de conexión)
io.on('connection', (socket) => {
  console.log('✅ Cliente conectado:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

// Iniciar servidor (usamos httpServer.listen en lugar de app.listen)
httpServer.listen(PORT, () => {
  console.log(`✅ Servidor con Socket.IO en http://localhost:${PORT}`);
});