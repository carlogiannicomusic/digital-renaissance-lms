# Digital Renaissance LMS

A modern Learning Management System built with Next.js, TypeScript, and PostgreSQL. Features course management, flexible scheduling, and a clean monochromatic design.

## Features

- **Course Management**: Create and organize courses with ease
- **Flexible Scheduling**: Schedule classes with customizable time slots, days, and locations
- **Student Enrollment**: Track student enrollments and participation
- **Role-Based Access**: Different permissions for students, teachers, and administrators
- **Modern UI**: Clean, monochromatic design following Digital Renaissance branding

## Tech Stack

- **Frontend**: Next.js 16 with App Router, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (ready to implement)
- **Validation**: Zod

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+

## Getting Started

### 1. Clone and Install

```bash
cd digital-renaissance-lms
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb digital_renaissance_lms
```

Configure your `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/digital_renaissance_lms"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 3. Run Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
digital-renaissance-lms/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── courses/           # Course pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── courses/          # Course-specific components
├── lib/                   # Utilities
│   ├── db/               # Database utilities
│   └── validations/      # Zod schemas
├── prisma/               # Database schema
└── types/                # TypeScript types
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Database Commands

```bash
npx prisma studio              # Open Prisma Studio GUI
npx prisma migrate dev         # Create and apply migration
npx prisma generate            # Generate Prisma Client
```

## Design System

The UI follows a strict monochromatic black and white design with:
- 2px solid black borders
- Sharp edges (no rounded corners)
- Subtle gray hover states
- Consistent typography hierarchy

## Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed architecture and development guidelines.

## License

MIT
