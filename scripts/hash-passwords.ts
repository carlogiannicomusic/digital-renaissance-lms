import { prisma } from '../lib/db/prisma'
import bcrypt from 'bcryptjs'

async function hashPasswords() {
  console.log('🔐 Hashing test user passwords...\n')

  // Define test users with their plain text passwords
  const testUsers = [
    { email: 'admin@digitalrenaissance.com', password: 'admin123', role: 'ADMINISTRATOR' },
    { email: 'teacher@digitalrenaissance.com', password: 'teacher123', role: 'TEACHER' },
    { email: 'student@digitalrenaissance.com', password: 'student123', role: 'STUDENT' },
  ]

  for (const userData of testUsers) {
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      })

      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      if (user) {
        // Update existing user
        await prisma.user.update({
          where: { email: userData.email },
          data: { password: hashedPassword },
        })
        console.log(`✅ Updated ${userData.role}: ${userData.email}`)
      } else {
        // Create new user
        await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.role.charAt(0) + userData.role.slice(1).toLowerCase(),
            password: hashedPassword,
            role: userData.role as any,
            status: 'ACTIVE',
          },
        })
        console.log(`✅ Created ${userData.role}: ${userData.email}`)
      }
    } catch (error) {
      console.error(`❌ Error processing ${userData.email}:`, error)
    }
  }

  console.log('\n✨ Password hashing completed!')
  console.log('\n📋 TEST CREDENTIALS (use these to login):')
  console.log('━'.repeat(50))
  console.log('ADMINISTRATOR')
  console.log('  Email: admin@digitalrenaissance.com')
  console.log('  Password: admin123')
  console.log('')
  console.log('TEACHER')
  console.log('  Email: teacher@digitalrenaissance.com')
  console.log('  Password: teacher123')
  console.log('')
  console.log('STUDENT')
  console.log('  Email: student@digitalrenaissance.com')
  console.log('  Password: student123')
  console.log('━'.repeat(50))
}

hashPasswords()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
