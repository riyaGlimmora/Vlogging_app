import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

app.use('/api/v1', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
