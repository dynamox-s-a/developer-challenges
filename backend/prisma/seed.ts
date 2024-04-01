import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const userSofia = await prisma.user.upsert({
    where: { email: 'sofia@dynamox.net' },
    update: {},
    create: {
      email: 'sofia@dynamox.net',
      fullName: 'Sofia de Oliveira',
      password: 'Secret1'
    },
  })

  const typePump = await prisma.machine_Type.upsert({
    where: { name: 'Pump' },
    update: {},
    create: {    
      name: 'Pump'
    },
  })

  const typeFan = await prisma.machine_Type.upsert({
    where: { name: 'Fan' },
    update: {},
    create: {    
      name: 'Fan'
    },
  })

  const sensorTcAg = await prisma.sensor.upsert({
    where: { name: 'TcAg' },
    update: {},
    create: {    
      name: 'TcAg'
    },
  })

  const sensorTcAs = await prisma.sensor.upsert({
    where: { name: 'TcAs' },
    update: {},
    create: {    
      name: 'TcAs'
    },
  })

  const sensorHF = await prisma.sensor.upsert({
    where: { name: 'HF+' },
    update: {},
    create: {    
      name: 'HF+'
    },
  })

  const machine01 = await prisma.machine.upsert({
    where: { name: 'Machine 01' },
    update: {},
    create: {    
      name: 'Machine 01',
      machineTypeId: typePump.id
    },
  })

  const machine02 = await prisma.machine.upsert({
    where: { name: 'Machine 02' },
    update: {},
    create: {    
      name: 'Machine 02',
      machineTypeId: typeFan.id
    },
  })

  const monitoringPoint01 = await prisma.monitoring_Point.upsert({
    where: { name: 'Monitoring Point 01' },
    update: {},
    create: {    
      name: 'Monitoring Point 01',
      sensorId: sensorHF.id,
      machineId: machine01.id
    },
  })



  const monitoringPoint02 = await prisma.monitoring_Point.upsert({
    where: { name: 'Monitoring Point 02' },
    update: {},
    create: {    
      name: 'Monitoring Point 02',
      sensorId: sensorTcAs.id,
      machineId: machine02.id
    },
  })

  console.log('SEED', { userSofia, typePump, typeFan, sensorTcAg, sensorTcAs, sensorHF, machine01, machine02, monitoringPoint01, monitoringPoint02 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })