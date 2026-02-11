import 'dotenv/config'
import bcrypt from 'bcrypt'
import { prisma } from '../src/core/lib/prisma'

async function main() {
  const email = 'admin@dynamox.com'
  const password = 'admin123'
  const name = 'Admin'

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { name, email, passwordHash }
  })

  console.log('User seeded')
  console.log('User:', { email, password })

  await prisma.machine.deleteMany()

  const machineTypes = ['Pump', 'Pump', 'Pump', 'Fan', 'Fan'] as const

  for (let i = 1; i <= 5; i++) {
    const machine = await prisma.machine.create({
      data: {
        name: `Maquina ${i}`,
        type: machineTypes[i - 1],
        userId: user.id
      }
    })

    for (let j = 1; j <= 7; j++) {
      await prisma.monitoringPoint.create({
        data: {
          name: `Ponto ${j} - Maquina ${i}`,
          machineId: machine.id
        }
      })
    }

  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
