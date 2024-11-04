const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUser = async (body) => {
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return { status: 'INVALID_VALUE', data: { message: 'Campos inválidos' } };
  }

  try {
    const isUser = await prisma.user.findUnique({ where: { email } });
    if (isUser) {
      throw new Error('Usuário já cadastrado')
    }

    const user =  await prisma.user.create({ data: { name, password, email }});
    if (!user) return { status: 'INVALID_VALUE', data: { message: 'Não foi possível cadastrar' } };
    const data = { id: user.id, email: user.email, name: user.name };

    return { status: 'SUCCESSFUL', data: { ...data } };
  } catch (error) {
    return { status: 'INVALID_VALUE', data: { message: error.message } };
  }
};

const login = async (body) => {
  const { email, password } = body;
  if (!email || !password) {
    return { status: 'INVALID_VALUE', data: { message: 'Campos inválidos' } };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return { status: 'UNAUTHORIZED', data: { message: 'Usuário ou senha inválidos' } };
    }
    const data = { id: user.id, email: user.email, name: user.name };

    return { status: 'SUCCESSFUL', data: { ...data  } };
  } catch (error) {
    return { status: 'UNAUTHORIZED', data: { message: 'Usuário ou senha inválidos' } };
  }

}

module.exports = {
  createUser,
  login,
};
