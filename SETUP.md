# Digital Renaissance LMS - Setup Guide

## 🎯 Quick Start

Your LMS is ready with all **30 courses** from the Digital Renaissance catalog! Follow these steps to set up the database and see your courses.

## 📋 What's Already Done

✅ All 30 courses configured in seed script:
- 9 Shorts courses (DJ, Ableton Live, Pro Tools, etc.)
- 5 Basic Skills Programs
- 5 Professional Skills Programs (Certificates)
- 11 Additional courses (Music Theory, A&R, etc.)

✅ Development server running at http://localhost:3000
✅ Seed script with sample students and schedules
✅ Digital Renaissance brand identity fully implemented

## 🗄️ Database Setup Options

### Option 1: Install PostgreSQL Locally (Recommended for Development)

#### macOS (using Homebrew):
```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Create database
createdb digital_renaissance_lms
```

#### Configure Environment:
```bash
cd ~/Desktop/digital-renaissance-lms

# Copy the .env file and update it
cp .env.example .env
```

Edit `.env` and set:
```env
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/digital_renaissance_lms"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

#### Run Migrations and Seed:
```bash
# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed the database with all courses
npm run db:seed
```

### Option 2: Use Docker PostgreSQL (If you have Docker)

```bash
# Run PostgreSQL in Docker
docker run --name dr-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=digital_renaissance_lms \
  -p 5432:5432 \
  -d postgres:16

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/digital_renaissance_lms"

# Run migrations and seed
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
```

### Option 3: Use a Cloud Database (Production-ready)

Use services like:
- **Supabase** (free tier): https://supabase.com
- **Neon** (serverless Postgres): https://neon.tech
- **Railway**: https://railway.app

Just copy the connection string to your `.env` file.

## 🎨 Viewing the LMS

Once the database is set up:

1. **Home Page**: http://localhost:3000
   - Bold yellow hero section
   - Colorful feature blocks (Blue, Peach, Purple, Green)

2. **Courses Page**: http://localhost:3000/courses
   - All 30 courses with rotating DR colors
   - Click any course to see details

3. **Course Details**:
   - Purple header with course info
   - Schedule management interface
   - Create and delete schedules

## 📊 What's in the Seed Data

After running `npm run db:seed`, you'll have:

- **30 Courses** (all Digital Renaissance offerings)
- **1 Teacher** (Digital Renaissance Instructor)
- **5 Sample Students** (Ahmed, Priya, Carlos, Fatima, John)
- **5 Sample Schedules** (for the first few courses)
- **Sample Enrollments** (students enrolled in courses)

## 🛠️ Useful Commands

```bash
# Start development server
npm run dev

# View database in Prisma Studio
npx prisma studio

# Reset database and reseed
npx prisma migrate reset

# Run seed script only
npm run db:seed

# Generate Prisma Client after schema changes
npx prisma generate
```

## 🎓 Course Categories

Your LMS includes all these courses:

### Shorts (9 courses)
DJ, Ableton Live, Pro Tools, Vocal, Songwriting, Piano, Guitar, Bass, Drums

### Basic Skills Programs (5 courses)
Music Production & DJ, Singing-Songwriting, Music Performance, Audio Engineering, Music Industry

### Professional Skills Programs - Certificates (5 courses)
All basic skills as professional certificates

### Additional Courses (11 courses)
Music Theory & Ear Training, Audio Technologies, Management 101, Marketing 101, Music Events & Venues Management, Studio Recording, Mixing & Mastering, Live Sound Engineering, Composition & Arrangement, Music Industry 101, A&R

## 🔧 Troubleshooting

**Database connection errors?**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Make sure port 5432 isn't blocked

**Prisma errors?**
- Run: `npx prisma generate`
- Delete `node_modules/.prisma` and regenerate

**Seed script errors?**
- Make sure migrations ran first: `npx prisma migrate dev`
- Check database is empty or reset it: `npx prisma migrate reset`

## 🚀 Next Steps

1. Set up database (choose option above)
2. Run migrations and seed
3. Visit http://localhost:3000
4. Explore your courses!
5. Try creating schedules for courses
6. Enroll students in courses (via Prisma Studio or API)

## 📞 Need Help?

- Prisma docs: https://www.prisma.io/docs
- Next.js docs: https://nextjs.org/docs
- PostgreSQL docs: https://www.postgresql.org/docs/
