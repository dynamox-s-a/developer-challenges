// Interceptando e validando o token de acesso

const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.readers.authorization;

    if(!authHeader){
        return res.status(400).send({error: 'erro'});
    }

    const parts = authHeader.split(' ');

    if (!parts.length === 2){
        return res.status(400).send({error: 'erro'});
    }

    const [ schema, token ] = parts;

    if (!/^Bearer$/i.test(schema)) {
        return res.status(400).send({error: 'erro'});
    }

    jwt.verify(token, authConfig.segredo, (err, decoded) => {
        if(err){
            return res.status(400).send({error: 'erro'});
        }
        req.userId = decoded.id;
        return next();
    })
}