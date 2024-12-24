const userService = require('../service/userService');
const bcrypt = require('bcrypt');

exports.postAddNewUser = async (req, res) => {
  const { email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  
  userService.postAddNewUser(email, hashedPassword)
  .then(() => {
      res.status(200).send({ data: { email }, message: 'Usuário cadastrado com sucesso!' });
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
};

exports.putEditUserById = (req, res) => {
  const { email, password  } = req.body
  const { idUsuario } = req.params

  userService.putEditUserById(email, password, idUsuario)
    .then(() => {
      res.status(200).send({ message: 'Usuário alterado com sucesso!' });
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
};