import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import machineRoutes from './routes/machineRoutes';
import monitoringRoutes from './routes/monitoringRoutes';
import sensorRoutes from './routes/sensorRoutes';
import authRoutes from './routes/authRoutes'; // Importa as rotas de autenticação
import { protect } from './middleware/authMiddleware';

dotenv.config();

connectDB(); // Conecta ao MongoDB usando a URI definida no .env

const app = express();

app.use(cors());
app.use(express.json());

// Rotas de autenticação
app.use('/api/auth', authRoutes); // Configura a rota para autenticação (login e registro)

// Rotas de máquinas, monitoramentos e sensores
app.use('/api/machines', machineRoutes); // Configure a rota para máquinas
app.use('/api/machines/:id/monitorings', protect, monitoringRoutes); // Configure a rota para monitoramentos
app.use('/api/machines/:id/monitorings/:monitoringId/sensors', protect, sensorRoutes); // Configure a rota para sensores

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
