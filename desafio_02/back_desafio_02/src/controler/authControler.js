// Criando, e autenticando usuario retornando o token JWT

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const User = require('../model/user');
const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

//Cadastro do usuario
router.post('/registro', async (req, res)=>{
    try{
        const user = User.create(req.body);

        res.send({ user, 
            token: generateToken({id: user.id}),
        });
    }catch (err){
        return res.status(400).send({error: 'erro'});
    }
});

//Validadacao do usuario
router.post('/autenticacao', async(req, res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({ email }).select('+passaword');

    if(!user){
        return res.status(400).send({error: 'erro'});
    }
    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({error:'erro'});
    }
    user.password = undefined;

    res.send({ user, 
        token: generateToken({id: user.id}),
    });
})

module.exports = app => app.use('/auth', router);