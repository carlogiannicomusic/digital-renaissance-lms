import bcrypt from 'bcryptjs'

async function testBcrypt() {
  const password = 'admin123'
  const hash = '$2b$10$9awDuQO7uSk/E2qp40yIuex29QNzr54j13ZoOtXqkhWjtp1TJ17M2'

  console.log('🧪 Testing bcrypt hash...\n')
  console.log(`Password: "${password}"`)
  console.log(`Hash: ${hash}\n`)

  const isValid = await bcrypt.compare(password, hash)

  if (isValid) {
    console.log('✅ SUCCESS! Hash matches password "admin123"')
  } else {
    console.log('❌ FAILED! Hash does NOT match password "admin123"')
    console.log('\nThis means the hash in the database is incorrect.')
    console.log('Generating a new hash...\n')

    const newHash = await bcrypt.hash(password, 10)
    console.log('New hash for "admin123":')
    console.log(newHash)
  }
}

testBcrypt()
