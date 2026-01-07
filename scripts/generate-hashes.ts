import bcrypt from 'bcryptjs'

async function generateHashes() {
  const passwords = [
    { label: 'ADMINISTRATOR (admin123)', password: 'admin123' },
    { label: 'TEACHER (teacher123)', password: 'teacher123' },
    { label: 'STUDENT (student123)', password: 'student123' },
  ]

  console.log('🔐 BCRYPT PASSWORD HASHES')
  console.log('═'.repeat(70))
  console.log('')

  for (const { label, password } of passwords) {
    const hash = await bcrypt.hash(password, 10)
    console.log(`${label}:`)
    console.log(hash)
    console.log('')
  }

  console.log('═'.repeat(70))
  console.log('\n📝 HOW TO UPDATE IN PRISMA STUDIO:')
  console.log('1. Run: npx prisma studio')
  console.log('2. Open "User" table')
  console.log('3. Find each user by email')
  console.log('4. Replace password field with hash above')
  console.log('5. Save changes')
}

generateHashes()
