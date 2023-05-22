const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

userSchema.statics.authenticate = function(email, password) {
    const User = this;

    return User.findOne({ email })
        .then(user => {
            if(!user) {
                throw new Error('Usuário não encontrado.');
            }

            return bcrypt.compare(password, user.password)
                .then(match => {
                    if(!match) {
                        throw new Error('Senha incorreta.');
                    };

                    return user;
                });
        });
};

const User = mongoose.model('User', userSchema);

module.exports = User;