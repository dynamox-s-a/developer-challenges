const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../user');

//Function called in the path that gets all the created users
exports.getAllUsers = (req, res) => {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(error => {
            res.status(500).send('Erro ao buscar usuários.');
        })
}

//Function called in the path that creates a new user
exports.createUser = [
    //Required parameters entries validation using express-validator
    body('name').notEmpty().withMessage('O nome é obrigatório.'),
    body('email').notEmpty().withMessage('O e-mail é obrigatório.').isEmail().withMessage('O e-mail deve ser válido.'),
    body('password').notEmpty().withMessage('A senha é obrigatória.'),

    (req, res) => {
        //Validation errors verification
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        const saltRounds = 10;

        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if(err) {
                res.status(500).send('Erro ao criar usuário.');
                return;
            }

            const user = new User({
                name,
                email,
                password: hashedPassword
            });
        
            user.save()
                .then(() => {
                    res.status(201).send('Usuário criado com sucesso.');
                })
                .catch((error) => {
                    res.status(500).send('Erro ao criar usuário.')
                });;
        })
    }
];

//Function called in the login path
exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    User.authenticate(email, password)
        .then(user => {
            const sessionId = jwt.sign({ userId: user._id }, 'seu-segredo-aqui');

            res.json({ userId: user._id, sessionId });
        })
        .catch(error => {
            res.status(401).json({ message: "Falha na autenticação" });
        })
};