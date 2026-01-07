import { prisma } from '../lib/db/prisma'
import bcrypt from 'bcryptjs'

async function debugUsers() {
  console.log('🔍 Checking database users...\n')

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: [
          'admin@digitalrenaissance.com',
          'teacher@digitalrenaissance.com',
          'student@digitalrenaissance.com',
        ],
      },
    },
    select: {
      email: true,
      name: true,
      role: true,
      status: true,
      password: true,
    },
  })

  if (users.length === 0) {
    console.log('❌ No test users found in database!')
    console.log('Run Prisma Studio and check if users exist.')
    return
  }

  console.log(`Found ${users.length} test users:\n`)

  for (const user of users) {
    console.log('─'.repeat(70))
    console.log(`Email: ${user.email}`)
    console.log(`Name: ${user.name}`)
    console.log(`Role: ${user.role}`)
    console.log(`Status: ${user.status}`)
    console.log(`Password hash: ${user.password.substring(0, 20)}...`)

    // Test if password is hashed
    const isHashed = user.password.startsWith('$2b$') || user.password.startsWith('$2a$')
    console.log(`Is bcrypt hash: ${isHashed ? '✅ YES' : '❌ NO (PLAIN TEXT!)'}`)

    if (isHashed) {
      // Test if hash matches expected password
      const testPasswords = ['admin123', 'teacher123', 'student123']
      for (const testPwd of testPasswords) {
        const matches = await bcrypt.compare(testPwd, user.password)
        if (matches) {
          console.log(`✅ Password matches: "${testPwd}"`)
          break
        }
      }
    }
    console.log('')
  }
  console.log('─'.repeat(70))
}

debugUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
