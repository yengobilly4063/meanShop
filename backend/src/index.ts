import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fs, { WriteStream } from 'fs';
import connectDB from './db_conn/conn';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import cors from 'cors';
import { authJwt } from './middlewares/jwtAuth';
import { errorHandler } from './middlewares/errorHandler';

// Load config variabes from .env
dotenv.config();
const app: Application = express();

// Connect to MongoDB
connectDB();

// Log stream to log requests to server in append mode
const accessLogStream: WriteStream = fs.createWriteStream(path.join(__dirname, '../logs/', 'access.log'), {
	flags: 'a',
});

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

// Use this later to serve static files from backend and use in frontend
// app.use(express.static(path.join(__dirname, '../public/')));

// Middlewares
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('tiny'));
	app.use(morgan('tiny', { stream: accessLogStream }));
}
// Serve images from the public folder
app.use('/public/uploads', express.static(__dirname  + '/public/uploads'));
// Not used for in order to have more granuar control on protected routes
// app.use(authJwt())
app.use(errorHandler);

// Basic port and api
const PORT: number = Number(process.env.PORT);
const api: string = String(process.env.API_URL);

// Routes
app.use(`${api}/products`, productRoutes);
app.use(`${api}/categories`, categoryRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/orders`, orderRoutes);

app.listen(PORT, () => {
	console.log(`Running server in ${process.env.NODE_ENV} on port ${PORT}`);
});
