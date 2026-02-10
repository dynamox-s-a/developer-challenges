import 'dotenv/config'
import bcrypt from 'bcrypt'
import { prisma } from '../src/lib/prisma'

async function main() {
  const email = 'user@dynamox.com'
  const password = 'dynamox123'

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash }
  })

  console.log('Seed user created:', { email, password })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
