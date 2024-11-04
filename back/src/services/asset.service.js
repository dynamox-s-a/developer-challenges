const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerAsset = async (body) => {
  const { name, type } = body;

  try {
    const asset =  await prisma.asset.create({ data: { name, type }});
    if (!asset) return { status: 'INVALID_VALUE', data: { message: 'Não foi possível cadastrar' } };
    const data = { id: asset.id, name: asset.name, type: asset.type };

    return { status: 'SUCCESSFUL', data: { ...data } };
  } catch (error) {
    return { status: 'INVALID_VALUE', data: { message: error.message } };
  }
};

const showAssets = async () => {
  try {
    const assets =  await prisma.asset.findMany();
    if (!assets) return { status: 'INVALID_VALUE', data: { message: 'Nenhum ativo encontrado' } };

    return { status: 'SUCCESSFUL', data: { assets } };
  } catch (error) {
    return { status: 'INVALID_VALUE', data: { message: error.message } };
  }
};

module.exports = {
  registerAsset,
  showAssets
};
