import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed...');

    // Verificar se já existe dados
    const existingUser = await prisma.user.findFirst();
    if (existingUser) {
        console.log('✅ Banco já possui dados. Seed já foi executado anteriormente.');
        return;
    }

    // Criar usuário
    const cryptPass = await bcrypt.hash('123456', 10);
    await prisma.user.create({
        data: {
            name: 'Giovanni',
            email: 'giovanni@example.com',
            password: cryptPass
        }
    });
    console.log('✅ Usuário criado');

    // Criar 10 sensores
    console.log('🔧 Criando sensores...');
    
    // 4 sensores HFp (para máquinas PUMP)
    const sensorHFp1 = await prisma.sensorMonitoring.create({
        data: { name: 'Sensor HFp Principal', sensorType: 'HFp' }
    });
    
    const sensorHFp2 = await prisma.sensorMonitoring.create({
        data: { name: 'Sensor HFp Secundário', sensorType: 'HFp' }
    });
    
    const sensorHFp3 = await prisma.sensorMonitoring.create({
        data: { name: null, sensorType: 'HFp' }
    });
    
    const sensorHFp4 = await prisma.sensorMonitoring.create({
        data: { name: null, sensorType: 'HFp' }
    });

    // 3 sensores TcAs (para máquinas FAN)
    const sensorTcAs1 = await prisma.sensorMonitoring.create({
        data: { name: 'Sensor TcAs A', sensorType: 'TcAs' }
    });
    
    const sensorTcAs2 = await prisma.sensorMonitoring.create({
        data: { name: null, sensorType: 'TcAs' }
    });
    
    const sensorTcAs3 = await prisma.sensorMonitoring.create({
        data: { name: 'Sensor TcAs Reserva', sensorType: 'TcAs' }
    });

    // 3 sensores TcAg (para máquinas FAN)
    const sensorTcAg1 = await prisma.sensorMonitoring.create({
        data: { name: 'Sensor TcAg Principal', sensorType: 'TcAg' }
    });
    
    const sensorTcAg2 = await prisma.sensorMonitoring.create({
        data: { name: null, sensorType: 'TcAg' }
    });
    
    const sensorTcAg3 = await prisma.sensorMonitoring.create({
        data: { name: 'Sensor TcAg Backup', sensorType: 'TcAg' }
    });

    console.log('✅ 10 sensores criados');

    // Criar 10 máquinas
    console.log('🏭 Criando máquinas...');

    // 5 máquinas PUMP
    // PUMP 1 - com 2 sensores HFp
    await prisma.machine.create({
        data: {
            name: 'Bomba Hidráulica Principal',
            typeOfMachine: 'PUMP',
            statusMachine: 'ON',
            pointmonitoring1_id: sensorHFp1.id,
            pointmonitoring2_id: sensorHFp2.id
        }
    });

    // PUMP 2 - com 1 sensor HFp
    await prisma.machine.create({
        data: {
            name: 'Bomba de Pressurização',
            typeOfMachine: 'PUMP',
            statusMachine: 'ON',
            pointmonitoring1_id: sensorHFp3.id
        }
    });

    // PUMP 3 - com 1 sensor HFp
    await prisma.machine.create({
        data: {
            name: 'Bomba de Recirculação',
            typeOfMachine: 'PUMP',
            statusMachine: 'OFF',
            pointmonitoring1_id: sensorHFp4.id
        }
    });

    // PUMP 4 - sem sensores
    await prisma.machine.create({
        data: {
            name: 'Bomba de Reserva A',
            typeOfMachine: 'PUMP',
            statusMachine: 'OFF'
        }
    });

    // PUMP 5 - sem sensores
    await prisma.machine.create({
        data: {
            name: 'Bomba de Reserva B',
            typeOfMachine: 'PUMP',
            statusMachine: 'ON'
        }
    });

    // 5 máquinas FAN
    // FAN 1 - com 2 sensores (TcAs + TcAg)
    await prisma.machine.create({
        data: {
            name: 'Ventilador Industrial Principal',
            typeOfMachine: 'FAN',
            statusMachine: 'ON',
            pointmonitoring1_id: sensorTcAs1.id,
            pointmonitoring2_id: sensorTcAg1.id
        }
    });

    // FAN 2 - com 1 sensor TcAs
    await prisma.machine.create({
        data: {
            name: 'Ventilador de Refrigeração',
            typeOfMachine: 'FAN',
            statusMachine: 'ON',
            pointmonitoring1_id: sensorTcAs2.id
        }
    });

    // FAN 3 - com 1 sensor TcAg
    await prisma.machine.create({
        data: {
            name: 'Exaustor de Ar',
            typeOfMachine: 'FAN',
            statusMachine: 'OFF',
            pointmonitoring1_id: sensorTcAg2.id
        }
    });

    // FAN 4 - sem sensores
    await prisma.machine.create({
        data: {
            name: 'Ventilador de Backup',
            typeOfMachine: 'FAN',
            statusMachine: 'OFF'
        }
    });

    // FAN 5 - sem sensores
    await prisma.machine.create({
        data: {
            name: 'Circulador de Ar',
            typeOfMachine: 'FAN',
            statusMachine: 'ON'
        }
    });

    console.log('✅ 10 máquinas criadas');
    console.log('📊 Resumo do seed:');
    console.log('   - 1 usuário');
    console.log('   - 10 sensores (4 HFp, 3 TcAs, 3 TcAg)');
    console.log('   - 10 máquinas (5 PUMP, 5 FAN)');
    console.log('   - Sensores livres: TcAs Reserva, TcAg Backup');
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