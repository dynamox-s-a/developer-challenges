const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const machineSchema = new mongoose.Schema({
    _userId: String,
    name: String,
    type: String
});

const Machine = mongoose.model('Machine', machineSchema);

module.exports = Machine;