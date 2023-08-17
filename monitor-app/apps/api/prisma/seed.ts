import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'teste@dynamox.net' },
    update: {},
    create: {
      email: 'teste@dynamox.net',
      name: 'John Doe',
      password: '$2b$10$Y1JTE4Clbs7ouy6xjl6KneTq3YnPNXclqP7nYv0oJCA8g.FNByI.S'
    }
  })
  const { password, ...session } = user
  console.log(session, ' -> added to database')
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
