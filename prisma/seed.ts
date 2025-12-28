import 'dotenv/config'
import { prisma } from '../lib/db/prisma'

async function main() {
  console.log('🌱 Seeding database...')
  console.log('📊 Database URL:', process.env.DATABASE_URL)

  // Create a default teacher
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@digitalrenaissance.education' },
    update: {},
    create: {
      email: 'teacher@digitalrenaissance.education',
      name: 'Digital Renaissance Instructor',
      password: '$2b$10$YourHashedPasswordHere', // Change this in production
      role: 'TEACHER',
    },
  })

  console.log('✅ Created teacher:', teacher.name)

  // SHORTS COURSES
  const shorts = [
    { title: 'DJ', description: 'Master the art of DJing with hands-on training in mixing, beatmatching, and crowd engagement.' },
    { title: 'Ableton Live', description: 'Learn music production fundamentals using Ableton Live, the industry-standard DAW.' },
    { title: 'Pro Tools', description: 'Professional audio recording and editing with Pro Tools.' },
    { title: 'Vocal', description: 'Develop your vocal technique, tone, and performance skills.' },
    { title: 'Songwriting', description: 'Craft compelling songs with melody, lyrics, and structure.' },
    { title: 'Piano', description: 'Learn piano fundamentals from beginner to intermediate level.' },
    { title: 'Guitar', description: 'Master guitar techniques across multiple genres and styles.' },
    { title: 'Bass', description: 'Develop your bass playing with groove, technique, and theory.' },
    { title: 'Drums', description: 'Build your drumming foundation with rhythm, technique, and coordination.' },
  ]

  console.log('📚 Creating Shorts courses...')
  for (const course of shorts) {
    await prisma.course.create({
      data: {
        title: `Shorts: ${course.title}`,
        description: course.description,
        teacherId: teacher.id,
      },
    })
  }

  // BASIC SKILLS PROGRAMS
  const basicSkills = [
    { title: 'Music Production & DJ', description: 'Comprehensive introduction to music production and DJing techniques.' },
    { title: 'Singing-Songwriting', description: 'Combine vocal performance with songwriting to create original music.' },
    { title: 'Music Performance', description: 'Develop stage presence and performance skills across instruments.' },
    { title: 'Audio Engineering', description: 'Learn the fundamentals of recording, mixing, and mastering.' },
    { title: 'Music Industry', description: 'Understand the business side of music, from contracts to distribution.' },
  ]

  console.log('📚 Creating Basic Skills Programs...')
  for (const course of basicSkills) {
    await prisma.course.create({
      data: {
        title: `Basic Skills: ${course.title}`,
        description: course.description,
        teacherId: teacher.id,
      },
    })
  }

  // PROFESSIONAL SKILLS PROGRAMS (CERTIFICATES)
  const professionalSkills = [
    { title: 'Music Production & DJ', description: 'Professional certificate program in music production and DJing.' },
    { title: 'Singing-Songwriting', description: 'Professional certificate combining vocal training and songwriting.' },
    { title: 'Music Performance', description: 'Professional certificate in live music performance.' },
    { title: 'Audio Engineering', description: 'Professional certificate in audio engineering and production.' },
    { title: 'Music Industry', description: 'Professional certificate in music business and industry.' },
  ]

  console.log('📚 Creating Professional Skills Programs (Certificates)...')
  for (const course of professionalSkills) {
    await prisma.course.create({
      data: {
        title: `Certificate: ${course.title}`,
        description: course.description,
        teacherId: teacher.id,
      },
    })
  }

  // ADDITIONAL COURSES
  const additional = [
    { title: 'Music Theory & Ear Training', description: 'Develop your musical ear and understanding of music theory.' },
    { title: 'Audio Technologies', description: 'Explore cutting-edge audio technology and digital tools.' },
    { title: 'Management 101', description: 'Essential management skills for music professionals.' },
    { title: 'Marketing 101', description: 'Music marketing strategies for the digital age.' },
    { title: 'Music Events & Venues Management', description: 'Learn to manage music events and venue operations.' },
    { title: 'Studio Recording', description: 'Professional studio recording techniques and workflows.' },
    { title: 'Mixing & Mastering', description: 'Advanced mixing and mastering for professional releases.' },
    { title: 'Live Sound Engineering', description: 'Master live sound reinforcement and engineering.' },
    { title: 'Composition & Arrangement', description: 'Create original compositions and arrangements.' },
    { title: 'Music Industry 101', description: 'Introduction to the music business ecosystem.' },
    { title: 'A&R', description: 'Artist & Repertoire: talent scouting and artist development.' },
  ]

  console.log('📚 Creating Additional courses...')
  for (const course of additional) {
    await prisma.course.create({
      data: {
        title: course.title,
        description: course.description,
        teacherId: teacher.id,
      },
    })
  }

  // Create some sample schedules for the first few courses
  console.log('📅 Creating sample schedules...')
  const courses = await prisma.course.findMany({ take: 5 })

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
  const locations = ['Studio A', 'Studio B', 'Main Hall', 'Recording Room', 'Performance Space']

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i]
    const startDate = new Date()
    startDate.setHours(10 + i * 2, 0, 0, 0)
    const endDate = new Date()
    endDate.setHours(12 + i * 2, 0, 0, 0)

    await prisma.courseSchedule.create({
      data: {
        courseId: course.id,
        startTime: startDate,
        endTime: endDate,
        dayOfWeek: days[i % days.length] as any,
        location: locations[i % locations.length],
      },
    })
  }

  // Create test accounts for login
  console.log('👥 Creating test user accounts...')

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@digitalrenaissance.com',
      name: 'Admin User',
      password: 'admin123', // Plain text for development
      role: 'ADMINISTRATOR',
      status: 'ACTIVE',
    },
  })
  console.log('✅ Created admin:', adminUser.email)

  const teacherUser = await prisma.user.create({
    data: {
      email: 'teacher@digitalrenaissance.com',
      name: 'Teacher User',
      password: 'teacher123', // Plain text for development
      role: 'TEACHER',
      status: 'ACTIVE',
    },
  })
  console.log('✅ Created teacher:', teacherUser.email)

  const studentUser = await prisma.user.create({
    data: {
      email: 'student@digitalrenaissance.com',
      name: 'Student User',
      password: 'student123', // Plain text for development
      role: 'STUDENT',
      status: 'ACTIVE',
    },
  })
  console.log('✅ Created student:', studentUser.email)

  // Create some sample students
  console.log('👥 Creating sample students...')
  const students = [
    { name: 'Ahmed Al-Rashid', email: 'ahmed@example.com' },
    { name: 'Priya Sharma', email: 'priya@example.com' },
    { name: 'Carlos Santos', email: 'carlos@example.com' },
    { name: 'Fatima Hassan', email: 'fatima@example.com' },
    { name: 'John Lee', email: 'john@example.com' },
  ]

  for (const studentData of students) {
    const student = await prisma.user.create({
      data: {
        email: studentData.email,
        name: studentData.name,
        password: '$2b$10$YourHashedPasswordHere', // Change this in production
        role: 'STUDENT',
      },
    })

    // Enroll student in 2-3 random courses
    const randomCourses = courses
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 2)

    for (const course of randomCourses) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
        },
      })
    }
  }

  // Create Rooms for the new Class model
  console.log('🏢 Creating rooms...')
  const roomsData = [
    { name: 'Studio 1', capacity: 10, equipment: ['Piano', 'Whiteboard', 'Audio Interface'] },
    { name: 'Studio 2', capacity: 8, equipment: ['Drum Kit', 'Amplifiers', 'Microphones'] },
    { name: 'Studio 3', capacity: 12, equipment: ['DJ Equipment', 'Turntables', 'Mixer'] },
    { name: 'Production Lab', capacity: 15, equipment: ['Computers', 'Ableton Live', 'Pro Tools', 'MIDI Controllers'] },
    { name: 'Room 201', capacity: 6, equipment: ['Guitar Amps', 'Bass Amp', 'Microphones'] },
    { name: 'Recording Studio', capacity: 5, equipment: ['Vocal Booth', 'Recording Console', 'Studio Monitors'] },
    { name: 'Performance Hall', capacity: 50, equipment: ['Stage', 'PA System', 'Lighting'] },
    { name: 'Practice Room A', capacity: 4, equipment: ['Piano', 'Music Stands'] },
  ]

  const rooms = []
  for (const roomData of roomsData) {
    const room = await prisma.room.create({ data: roomData })
    rooms.push(room)
  }

  // Create some pending users for approval testing
  console.log('👥 Creating pending users...')
  const pendingUsers = [
    { name: 'Emma Thompson', email: 'emma.t@pending.com', phone: '(555) 234-5678', role: 'STUDENT' as const },
    { name: 'Michael Chen', email: 'mchen@pending.com', phone: '(555) 876-5432', role: 'TEACHER' as const },
    { name: 'Sofia Garcia', email: 'sofia.g@pending.com', phone: '(555) 345-6789', role: 'STUDENT' as const },
  ]

  for (const userData of pendingUsers) {
    await prisma.user.create({
      data: {
        ...userData,
        password: '$2b$10$YourHashedPasswordHere',
        status: 'PENDING',
      },
    })
  }

  // Create sample Classes using the new Class model
  console.log('📚 Creating sample classes...')
  const teachers = await prisma.user.findMany({ where: { role: 'TEACHER' } })
  const classesData = [
    {
      title: 'Piano Masterclass',
      teacherName: 'Maria Rodriguez',
      roomId: rooms[0].id,
      dayOfWeek: 'MONDAY' as const,
      startTime: '10:00',
      endTime: '11:30',
      classType: 'GROUP' as const,
      color: 'blue',
      studentCount: 8,
    },
    {
      title: 'Music Theory 101',
      teacherName: 'Prof. Sarah Williams',
      roomId: rooms[3].id,
      dayOfWeek: 'TUESDAY' as const,
      startTime: '14:00',
      endTime: '15:30',
      classType: 'GROUP' as const,
      color: 'purple',
      studentCount: 12,
    },
    {
      title: 'DJ Techniques',
      teacherName: 'DJ Marcus Lee',
      roomId: rooms[2].id,
      dayOfWeek: 'WEDNESDAY' as const,
      startTime: '16:00',
      endTime: '18:00',
      classType: 'GROUP' as const,
      color: 'green',
      studentCount: 10,
    },
    {
      title: 'Private Vocal Lesson',
      teacherName: 'Maria Rodriguez',
      roomId: rooms[5].id,
      dayOfWeek: 'THURSDAY' as const,
      startTime: '10:00',
      endTime: '11:00',
      classType: 'PRIVATE' as const,
      color: 'peach',
      studentCount: 1,
    },
    {
      title: 'Guitar Fundamentals',
      teacherName: 'Carlos Mendez',
      roomId: rooms[4].id,
      dayOfWeek: 'FRIDAY' as const,
      startTime: '13:00',
      endTime: '14:30',
      classType: 'GROUP' as const,
      color: 'yellow',
      studentCount: 6,
    },
  ]

  for (const classData of classesData) {
    await prisma.class.create({
      data: {
        ...classData,
        teacherId: teachers[0]?.id || 'temp-id',
      },
    })
  }

  console.log('✅ Seeding completed successfully!')
  console.log(`📊 Total courses created: ${await prisma.course.count()}`)
  console.log(`👥 Total users created: ${await prisma.user.count()}`)
  console.log(`📅 Total schedules created: ${await prisma.courseSchedule.count()}`)
  console.log(`🎓 Total enrollments created: ${await prisma.enrollment.count()}`)
  console.log(`🏢 Total rooms created: ${await prisma.room.count()}`)
  console.log(`📚 Total classes created: ${await prisma.class.count()}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
