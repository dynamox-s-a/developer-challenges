import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function testUserModel() {
  try {
    console.log('Testing Prisma User model...');

    // Test if user property exists
    console.log('User delegate exists:', !!prisma.user);

    // Try to count users
    const count = await prisma.user.count();
    console.log('User count:', count);

    console.log('✅ User model is working!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserModel();
