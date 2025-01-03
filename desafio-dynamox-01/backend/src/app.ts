import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import machineRoutes from './routes/machineRoutes';

dotenv.config();
const app = express();

app.use(express.json());  
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);

mongoose.connect(process.env.MONGO_URI!, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.log('Erro ao conectar ao MongoDB: ', err));

app.listen(process.env.PORT || 5000, () => {
  console.log('Servidor rodando');
});
