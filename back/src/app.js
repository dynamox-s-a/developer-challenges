const express = require('express');
const cors = require('cors');
const { userRoutes, assetRoutes, sensorRoutes } = require('./routes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/user', userRoutes);
app.use('/asset', assetRoutes);
app.use('/sensor', sensorRoutes)

module.exports = app;
