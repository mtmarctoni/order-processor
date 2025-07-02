import dotenv from 'dotenv';
// @ts-ignore
import express, { type Express } from 'express';
// @ts-ignore
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import documentsRouter from './routes/documents.js';
import templatesRouter from './routes/templates.js';
import processedOrdersRouter from './routes/processedOrderRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL!,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/documents', documentsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/processed-orders', processedOrdersRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});