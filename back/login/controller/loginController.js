const loginService = require('../service/loginService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.validateUserToLogin = (req, res) => {
  const { email, password } = req.body
  loginService.validateUserToLogin(email, password)
  .then(async (result) => {
    if (result.rows.length === 0) {
      return res.status(401).send({ error: 'Usuário ou senha inválidos' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Usuário ou senha inválidos' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, 'secreta_key', { expiresIn: '24h' });
    res.status(200).send({ token, id: user.id, email: user.email });
  })
  .catch((error) => {
    res.status(500).send({ error });
  });
};
