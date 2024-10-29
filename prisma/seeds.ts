import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const hasSensors = await prisma.sensor.findMany();

  if(hasSensors.length > 0) return;

    await prisma.sensor.createMany({
      data: [
        { modelName: 'TcAg' },
        { modelName: 'TcAs' },
        { modelName: 'HF+' },
      ],
    });
    console.log('Seed data created successfully');
  }

main()
  .catch((e) => {
    console.error(e);
  });
