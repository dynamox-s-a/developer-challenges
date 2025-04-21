import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/db';
import authRoutes from './routes/authRoutes';
import machinesRoutes from './routes/machines';
import monitoringPointRoutes from './routes/monitoringPoints';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectToDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/machines', machinesRoutes);
app.use('/api/monitoring-points', monitoringPointRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
