const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const monitorintPointSchema = new mongoose.Schema({
    _userId: String,
    _machineId: String,
    _machineName: String,
    _machineType: String,
    name: String,
    sensorName: String
});

const MonitorintPoint = mongoose.model('MonitorintPoint', monitorintPointSchema);

module.exports = MonitorintPoint;