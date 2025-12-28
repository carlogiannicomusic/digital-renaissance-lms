# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Digital Renaissance LMS** is a modern Learning Management System built with Next.js, TypeScript, and PostgreSQL. The project follows a feature-based architecture using Next.js App Router for server-side rendering and API routes.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Encryption**: bcrypt

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Commands
```bash
npx prisma studio              # Open Prisma Studio GUI
npx prisma migrate dev         # Create and apply migration
npx prisma migrate deploy      # Apply migrations in production
npx prisma db pull             # Pull schema from existing database
npx prisma db push             # Push schema changes without migration
npx prisma generate            # Generate Prisma Client
npx prisma dev                 # Run Postgres locally in terminal
```

### Running a Single Migration
```bash
npx prisma migrate dev --name migration_name    # Create a named migration
```

## Project Structure

```
digital-renaissance-lms/
├── app/                    # Next.js App Router directory
│   ├── dashboard/         # Dashboard routes and pages
│   ├── courses/           # Course management routes
│   ├── students/          # Student management routes
│   ├── auth/              # Authentication routes (login, register)
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (buttons, inputs, etc.)
│   ├── courses/          # Course-specific components
│   ├── students/         # Student-specific components
│   ├── dashboard/        # Dashboard-specific components
│   └── auth/             # Authentication components
├── lib/                   # Shared utilities and configurations
│   ├── utils/            # General utility functions
│   ├── auth/             # Authentication helpers
│   └── db/               # Database utilities and Prisma instance
├── types/                 # TypeScript type definitions
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     # Database schema definition
├── public/               # Static assets
└── .env                  # Environment variables (not committed)
```

## Architecture Principles

### Feature-Based Organization
The codebase follows a feature-based structure where related functionality is grouped together:
- Routes are organized by feature in the `app/` directory
- Components are organized by feature in the `components/` directory
- Shared components live in `components/ui/`

### Database Layer
- **Prisma ORM**: All database operations use Prisma for type-safe queries
- **Schema Location**: Database models are defined in `prisma/schema.prisma`
- **Client Generation**: Prisma Client is generated to `app/generated/prisma`
- **Migrations**: Use Prisma Migrate for schema versioning

### Data Flow
1. User requests hit Next.js App Router pages/routes
2. Server components fetch data directly using Prisma
3. Client components use Server Actions or API routes for mutations
4. Form validation uses Zod schemas
5. Authentication state managed by NextAuth.js

## Database Setup

### Initial Setup
1. Ensure PostgreSQL is installed and running
2. Configure `DATABASE_URL` in `.env` file:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/digital_renaissance_lms"
   ```
3. Run `npx prisma migrate dev` to apply initial schema
4. Run `npx prisma generate` to generate Prisma Client

### Adding New Models
1. Define model in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_model_name`
3. Run `npx prisma generate` to update Prisma Client
4. Import and use Prisma Client in your code

## Key Development Patterns

### Server Components (Default)
Components in the `app/` directory are Server Components by default. They can:
- Fetch data directly using Prisma
- Access environment variables
- Reduce client-side JavaScript bundle

### Client Components
Add `"use client"` directive for components that need:
- React hooks (useState, useEffect, etc.)
- Browser APIs
- Event listeners
- Interactive functionality

### Database Queries
Always use Prisma Client for database operations:
```typescript
import { PrismaClient } from '@/app/generated/prisma'
const prisma = new PrismaClient()
```

### Form Validation
Use Zod for runtime validation:
```typescript
import { z } from 'zod'
const schema = z.object({ /* schema definition */ })
```

## Environment Variables

Required environment variables in `.env`:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Application URL for NextAuth
- `NEXTAUTH_SECRET`: Secret for NextAuth session encryption

## Implemented Features

### Course Scheduling System
The application includes a complete course scheduling system with:

**Database Models**:
- `User`: Students, teachers, and administrators with role-based access
- `Course`: Course information linked to teachers
- `CourseSchedule`: Schedules with start/end times, day of week, and location
- `Enrollment`: Student enrollment tracking

**API Routes**:
- `POST /api/schedules`: Create new schedule
- `GET /api/schedules?courseId=xxx`: Fetch schedules (optionally filtered by course)
- `PATCH /api/schedules/[id]`: Update schedule
- `DELETE /api/schedules/[id]`: Delete schedule
- `GET /api/courses`: List all courses
- `GET /api/courses/[id]`: Get course details with schedules
- `POST /api/courses`: Create new course
- `PATCH /api/courses/[id]`: Update course
- `DELETE /api/courses/[id]`: Delete course

**UI Components**:
- `ScheduleForm`: Create course schedules with validation
- `CourseSchedule`: Display course schedules with delete functionality
- Base UI components (Button, Input, Select) with Digital Renaissance branding

**Pages**:
- `/courses`: List all courses
- `/courses/[id]`: View course details and manage schedules

### Validation Schemas
Located in `lib/validations/`:
- `schedule.ts`: Schedule creation and update validation
- `course.ts`: Course creation and update validation

## Design System (Digital Renaissance Brand Identity)

### Overview
The Digital Renaissance LMS follows the official Digital Renaissance Institute for Creative Arts brand identity guidelines (V1 250519: May 2025). The design emphasizes cultural diversity through strict monochromatic color blocks, bold typography, and grid-based layouts.

### Color Palette

**Primary Colors:**
- **DR Yellow** (#F2EC62) - Hero sections, primary accent
- **DR Black** (#000000) - Text, backgrounds, CTAs

**Secondary Colors:**
- **DR Blue** (#4db8d3) - Course sections
- **DR Peach** (#f39a76) - Schedule sections
- **DR Purple** (#d384d2) - Course detail pages
- **DR Green** (#22b573) - Student sections
- **DR White** (#FFFFFF) - Backgrounds

### Monochromatic Design Principle

**CRITICAL**: Each section must be strictly monochromatic. Options:
1. Black text on colored background (`bg-dr-yellow text-dr-black`)
2. Colored/white text on black background (`bg-dr-black text-dr-white`)
3. Bordering monochromatic blocks (adjacent sections with different colors)

### Typography

**Primary**: Proxima Nova (Semibold 600, Bold 700, Extrabold 800)
**Fallbacks**: Helvetica Neue, Avenir, system-ui

**Utilities**:
- `.font-display`: Extrabold, uppercase, tight tracking for heroes
- `.font-heading`: Bold for section headings
- Default: Proxima Nova for body text

### Grid System

Based on divisions of 2: `grid-dr-2`, `grid-dr-4`, `grid-dr-8`, `grid-dr-16`

### UI Component Patterns

**Buttons**: Bold uppercase, color variants (yellow/blue/peach/purple/green/black/white)
**Forms**: 2px borders, uppercase labels, minimal styling
**Sections**: Full-width monochromatic blocks, generous padding (`p-8 md:p-16`)
**Layout**: `max-w-7xl mx-auto` container, divisions-of-2 grid

## Important Notes

- The project uses the Next.js App Router (not Pages Router)
- Tailwind CSS v4 is configured for styling
- TypeScript strict mode is enabled
- Prisma Client is generated to a custom location: `app/generated/prisma`
- Git repository is already initialized
- All UI components follow the Digital Renaissance monochromatic design
- Use the base UI components (Button, Input, Select) for consistency
