import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PORT,FRONTEND_URL } from './config/env.js';
import compression from 'compression';
import helmet from 'helmet';
import {apiLimiter} from './config/limiter.js'

import authRouter from "./routes/auth.routes.js";
import productsRouter from "./routes/products.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import categoryRouter from "./routes/category.routes.js";

const app = express();

// Security headers
app.use(helmet());

// Compression middleware - reduces payload size
app.use(compression());

// Apply rate limiting to all requests
app.use(apiLimiter);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(errorMiddleware);

app.use(cors({
	origin: `${FRONTEND_URL}`,
	credentials: true,
}))

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoryRouter);



app.get("/", (req,res) => {
	res.send("Welcome to Ecommerce Backend API");
});

app.listen(PORT, () => {
	console.log(`Ecommerce Backend API is running on http://localhost:${PORT}`);
})

export default app;