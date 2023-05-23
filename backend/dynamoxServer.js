const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());

//Database connection
require('./database');

//Controllers import
const userController = require('./controllers/userController');
const machineController = require('./controllers/machineController');
const monitoringPointController = require('./controllers/monitoringPointController');

//Middleware that analyses the request's body
app.use(express.json());

app.get('/users', userController.getAllUsers);
app.get('/machines/:_userId', machineController.getMachineFromUser);
app.get('/monitoringPoints/:_userId', monitoringPointController.getMonitoringPointFromUser);

app.post('/users', userController.createUser);
app.post('/login', userController.loginUser);
app.post('/machines', machineController.createMachine);
app.post('/monitoringPoints', monitoringPointController.createMonitoringPoint);

app.delete('/machines/:id', machineController.deleteMachine);
app.delete('/monitoringPoints/:id', monitoringPointController.deleteMonitoringPoint);

app.put('/machines/:id', machineController.updateMachine);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});