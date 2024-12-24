require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT
const cors = require('cors');

const app = express()
app.use(express.json({ limit: '100mb' }))
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json())

const userRoutes = require('./user/routes/userRoutes');
const loginRoutes = require('./login/routes/loginRoutes');
const machineRoutes = require('./machine/routes/machineRoutes');
const pointRoutes = require('./point/routes/pointRoutes');
const sensorRoutes = require('./sensor/routes/sensorRoutes');

app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/machine', machineRoutes);
app.use('/point', pointRoutes);
app.use('/sensor', sensorRoutes);

app.listen(port, () => {
  console.log(`API EXECUTANDO - PORTA: ${port}`)
})