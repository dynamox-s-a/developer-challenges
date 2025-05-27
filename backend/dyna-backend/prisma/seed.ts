import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient();

async function main() {

    // const type1 = await prisma.typeOfMachine.create({
    //     data: { name: 'Pump' }
    // })

    // const type2 = await prisma.typeOfMachine.create({
    //     data: { name: 'Fan' }
    // })

    // const statusActive = await prisma.statusMachine.create({
    //     data: { name: 'Active' }
    // })

    // const statusInactive = await prisma.statusMachine.create({
    //     data: { name: 'Inative' }
    // })

    // const HFplus = await prisma.typeOfSensor.create({
    //     data: { name: 'HF+' },
    // });

    // const TcAs = await prisma.typeOfSensor.create({
    //     data: { name: 'TcAs' },
    // });

    // const TcAg = await prisma.typeOfSensor.create({
    //     data: { name: 'TcAg' },
    // });


    const cryptPass = await bcrypt.hash('123456', 10);

    await prisma.user.create({
        data: {
            name: 'Giovanni',
            email: 'giovanni@example.com',
            password: cryptPass
        }
    })

    console.log('✅ Seed concluído com sucesso!');



}

main()
    .catch((e) => {
        console.error('❌ Erro ao executar seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });