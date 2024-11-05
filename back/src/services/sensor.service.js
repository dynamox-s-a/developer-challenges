const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerSensor = async (body) => {
  const { name, type, assetId } = body;

  try {
    const assetExists = await prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!assetExists) {
      return { status: 'INVALID_VALUE', data: { message: 'Asset não encontrado' } };
    }

    const sensor = await prisma.sensor.create({
      data: {
        name,
        type,
        asset: {
          connect: { id: assetId },
        },
      },
      include: {
        asset: true,
      },
    });
    if (!sensor) return { status: 'INVALID_VALUE', data: { message: 'Não foi possível cadastrar' } };
    const data = { id: sensor.id, name: sensor.name, type: sensor.type, asset: sensor.asset };

    return { status: 'SUCCESSFUL', data: { ...data } };
  } catch (error) {
    console.log(error)
    return { status: 'INVALID_VALUE', data: { message: error.message } };
  }
};

const showSensor = async () => {
  try {
    const sensors = await prisma.sensor.findMany({
      include: {
        asset: true,
      },
    });

    if (!sensors.length) {
      return { status: 'NOT_FOUND', data: { message: 'Nenhum sensor encontrado' } };
    }

    return { status: 'SUCCESSFUL', data: sensors };
  } catch (error) {
    console.error(error);
    return { status: 'ERROR', data: { message: 'Erro ao buscar sensores' } };
  }
};

module.exports = {
  registerSensor,
  showSensor
};
