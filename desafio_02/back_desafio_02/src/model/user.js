// Esquema dos paramentros do Usuario

const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        select: false,
    },

});

UserSchema.pre('save', function(next){
    const hash = bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;