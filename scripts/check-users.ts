import { prisma } from '../lib/db/prisma'

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: [
            'admin@digitalrenaissance.com',
            'teacher@digitalrenaissance.com',
            'student@digitalrenaissance.com'
          ]
        }
      },
      select: {
        email: true,
        name: true,
        role: true,
        status: true,
        password: true
      }
    })

    console.log('\n📋 Test Users in Database:\n')
    for (const user of users) {
      console.log(`Email: ${user.email}`)
      console.log(`Name: ${user.name}`)
      console.log(`Role: ${user.role}`)
      console.log(`Status: ${user.status}`)
      console.log(`Password Hash: ${user.password.substring(0, 30)}...`)
      console.log(`Hash starts with $2b$: ${user.password.startsWith('$2b$')}`)
      console.log('---')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
