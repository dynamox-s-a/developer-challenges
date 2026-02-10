import 'dotenv/config'
import bcrypt from 'bcrypt'
import { prisma } from '../src/core/lib/prisma'

async function main() {
  const email = 'admin@dynamox.com'
  const password = 'admin123'
  const name = 'Admin'

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { name, email, passwordHash }
  })

  console.log('✅ Seed executed')
  console.log('User:', { email, password })
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
