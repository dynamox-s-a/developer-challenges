const jwt = require("jsonwebtoken");

const db = [{email: "teste@gmail.com", password: "teste"}];

const authenticate = async ({email, password}) => {
  const user = db.find(
    (user) => user.password === password && user.email === email
  );

  if (user) {
    const token = await jwt.sign({email}, "configuracaodasuaaplicacao");

    return {
      token,
      user,
    };
  }
};

module.exports = {
  authenticate,
};
