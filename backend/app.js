import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PORT, FRONTEND_URL } from './config/env.js';
import compression from 'compression';
import helmet from 'helmet';
import { apiLimiter } from './config/limiter.js'
import path from 'path';
import { fileURLToPath } from 'url';

// Convertir __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRouter from "./routes/auth.routes.js";
import productsRouter from "./routes/products.routes.js";
import categoryRouter from "./routes/category.routes.js";
import ordersRouter from "./routes/orders.routes.js";
import usersRouter from "./routes/users.routes.js";
import siteConfigRouter from "./routes/siteConfig.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Security headers - configuración menos restrictiva para desarrollo
app.use(
	helmet({
		crossOriginResourcePolicy: { policy: 'cross-origin' }, // Permitir recursos cross-origin
		contentSecurityPolicy: false, // Desactivar en desarrollo
	})
);

// Compression middleware - reduces payload size
app.use(compression());

// Apply rate limiting to all requests
app.use(apiLimiter);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración CORS mejorada
console.log("FRONTEND_URL configurado:", FRONTEND_URL);
app.use(cors({
	origin: FRONTEND_URL || "http://localhost:5173",
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
	allowedHeaders: [
		'Content-Type',
		'Authorization',
		'X-Requested-With',
		'Accept',
		'Origin'
	],
	exposedHeaders: ['set-cookie'],
	preflightContinue: false,
	optionsSuccessStatus: 204
}));

// Debug para ver las peticiones que llegan
app.use((req, res, next) => {
	console.log(`${req.method} ${req.originalUrl}`);
	next();
});

// Rutas API
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);
app.use("/api/site-config", siteConfigRouter);

// Middleware de manejo de errores (debe ir después de las rutas)
app.use(errorMiddleware);

// Ruta principal
app.get("/", (req, res) => {
	res.send("Welcome to Ecommerce Backend API");
});

// Iniciar servidor
app.listen(PORT, () => {
	console.log(`Ecommerce Backend API is running on http://localhost:${PORT}`);
})

export default app;