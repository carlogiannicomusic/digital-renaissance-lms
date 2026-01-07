const { PrismaClient } = require('../app/generated/prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createDemoUsers() {
  try {
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Create Admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@digitalrenaissance.com' },
      update: {},
      create: {
        email: 'admin@digitalrenaissance.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMINISTRATOR',
        status: 'ACTIVE'
      }
    });

    // Create Teacher
    const teacher = await prisma.user.upsert({
      where: { email: 'teacher@digitalrenaissance.com' },
      update: {},
      create: {
        email: 'teacher@digitalrenaissance.com',
        name: 'Teacher Demo',
        password: hashedPassword,
        role: 'TEACHER',
        status: 'ACTIVE'
      }
    });

    // Create Student
    const student = await prisma.user.upsert({
      where: { email: 'student@digitalrenaissance.com' },
      update: {},
      create: {
        email: 'student@digitalrenaissance.com',
        name: 'Student Demo',
        password: hashedPassword,
        role: 'STUDENT',
        status: 'ACTIVE'
      }
    });

    console.log('\n✅ Demo users created successfully!\n');
    console.log('Admin:   ' + admin.email);
    console.log('Teacher: ' + teacher.email);
    console.log('Student: ' + student.email);
    console.log('\nPassword for all: demo123\n');

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error creating demo users:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createDemoUsers();
