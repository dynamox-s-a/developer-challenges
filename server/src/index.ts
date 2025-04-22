import path from 'path';
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

app.use(cors({
  origin: 'https://developer-challenges-507u.onrender.com', 
  credentials: true, 
}));
app.use(express.json());

connectToDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/machines', machinesRoutes);
app.use('/api/monitoring-points', monitoringPointRoutes);


const clientBuildPath = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});