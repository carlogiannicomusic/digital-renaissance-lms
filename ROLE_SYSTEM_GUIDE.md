# Digital Renaissance LMS - Role-Based System Implementation Guide

## 🎯 Overview

Your LMS now has a complete database schema for:
- **Role-Based Access Control** (Student, Teacher, Administrator)
- **User Status Management** (Pending, Active, Inactive)
- **Real-time Chat System** (Group, Private, Announcements)
- **Document Management** (10 document types)

## ✅ What's Been Implemented

### 1. Database Schema (COMPLETE)

#### User Roles & Status
```typescript
enum UserRole {
  STUDENT      // Can enroll, view courses, chat, upload documents
  TEACHER      // Can manage courses, chat with students, view documents
  ADMINISTRATOR // Full access: approve users, manage system, view all data
}

enum UserStatus {
  PENDING   // New registrations, waiting for admin approval
  ACTIVE    // Approved users, can access the system
  INACTIVE  // Suspended/deactivated users
}
```

#### User Model (Enhanced)
- `id`: UUID
- `email`: Unique, required
- `name`: Full name
- `password`: Hashed
- `role`: Student/Teacher/Administrator
- `status`: Pending/Active/Inactive
- `phone`: Optional
- `avatarUrl`: Optional profile picture
- Relations: courses, enrollments, messages, chat participants, documents

#### Chat System Models
**ChatRoom**:
- Types: GROUP (class chats), PRIVATE (1-on-1), ANNOUNCEMENT (admin broadcasts)
- Linked to courses for group chats
- Participants and messages

**Message**:
- Content, sender, timestamp
- Belongs to a chat room

**ChatParticipant**:
- Many-to-many: users ↔ chat rooms
- Join timestamp

#### Document System
**Document Types**:
- PASSPORT
- VISA
- CONTRACT
- CONSENT (data processing)
- PHOTO
- EMIRATES_ID
- ADDRESS (UAE address)
- EMERGENCY_CONTACT
- PAYMENT (payment documents)
- ACADEMIC_INFO (program, start date, etc.)

**Document Model**:
- File URL, name, size
- User reference
- Document type
- Timestamps

## 📋 Implementation Roadmap

### Phase 1: Authentication & Authorization (Next Steps)

#### A. Registration with Role Selection
Create `/app/auth/register/page.tsx`:
```typescript
- Registration form with role dropdown (Student/Teacher)
- Email, name, password fields
- Automatically set status to PENDING
- Send welcome email
- Redirect to "waiting for approval" page
```

#### B. Admin Approval System
Create `/app/admin/users/page.tsx`:
```typescript
- List all PENDING users
- Display: name, email, requested role
- Actions: Approve (→ ACTIVE) or Reject (→ INACTIVE)
- Filter by status and role
- Search functionality
```

#### C. Login with Status Check
Update login to check:
1. User exists
2. Password correct
3. Status === ACTIVE (reject if PENDING or INACTIVE)

#### D. Role-Based Middleware
Create `middleware.ts`:
```typescript
- Protect routes by role
- /admin/* → ADMINISTRATOR only
- /teacher/* → TEACHER or ADMINISTRATOR
- /student/* → STUDENT or ADMINISTRATOR
- Redirect unauthorized users
```

### Phase 2: Role-Specific Dashboards

#### Student Dashboard (`/app/student/page.tsx`)
- My enrolled courses
- Upcoming classes (from schedules)
- Chat rooms (class groups + private with teachers)
- My documents
- Upload new documents

#### Teacher Dashboard (`/app/teacher/page.tsx`)
- My teaching courses
- Student roster per course
- Create/manage schedules
- Class group chats
- View student documents (for enrolled students)

#### Admin Dashboard (`/app/admin/page.tsx`)
- User management (approve/deactivate)
- All courses overview
- System analytics
  - Total users by role
  - Pending approvals count
  - Active courses
  - Messages sent today
- Document review system
- Broadcast announcements

### Phase 3: Chat System

#### A. Group Chat for Classes
**When to create**: Automatically when course is created
**Participants**: Teacher + all enrolled students
**Features**:
- Real-time messaging
- Message history
- File attachments (optional)

Create `/app/courses/[id]/chat/page.tsx`:
```typescript
- Display course name
- List participants
- Message feed (reverse chronological)
- Send message input
- Real-time updates (WebSocket or polling)
```

#### B. Private Chat (Student ↔ Teacher)
**When to create**: On-demand when student initiates
**Participants**: 1 student + 1 teacher

Create `/app/chat/private/[userId]/page.tsx`:
```typescript
- 1-on-1 conversation
- Same UI as group chat but private
```

#### C. Admin Announcements
**When to create**: Pre-created "General Announcements" room
**Participants**: All active users
**Permissions**: Only admins can send messages

Create `/app/announcements/page.tsx`:
```typescript
- Read-only for students/teachers
- Post area for admins
- Important notices highlighted
```

#### D. Chat Implementation with Pusher/Socket.io
For real-time functionality:
1. Install: `npm install pusher-js pusher`
2. Set up Pusher account (free tier)
3. Configure environment variables
4. Implement real-time subscriptions

**Alternative (simpler)**: Polling every 5 seconds

### Phase 4: Document Upload System

#### A. Student Document Upload
Create `/app/student/documents/page.tsx`:
```typescript
- Document type selector (dropdown)
- File upload input (PDF, images)
- Upload button
- List of uploaded documents
- Delete option
```

#### B. File Storage Setup
Options:
1. **Supabase Storage** (recommended)
2. **AWS S3**
3. **Cloudinary**

For Supabase:
```bash
npm install @supabase/supabase-js
```

Create bucket: `user-documents`
Structure: `{userId}/{documentType}/{filename}`

#### C. Admin Document Review
Create `/app/admin/documents/page.tsx`:
```typescript
- List all uploaded documents
- Filter by: user, document type, date
- View document (open in new tab)
- Approve/reject with notes
- Download option
```

### Phase 5: API Routes

Create these API endpoints:

#### User Management
- `POST /api/auth/register` - Register with role
- `POST /api/auth/login` - Login with status check
- `PATCH /api/admin/users/[id]/approve` - Approve user
- `PATCH /api/admin/users/[id]/status` - Change user status

#### Chat
- `GET /api/chat/rooms` - Get user's chat rooms
- `GET /api/chat/[roomId]/messages` - Get messages
- `POST /api/chat/[roomId]/messages` - Send message
- `POST /api/chat/create-private` - Create private chat

#### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user's documents
- `DELETE /api/documents/[id]` - Delete document
- `GET /api/admin/documents` - Get all documents (admin)

## 🛠️ Quick Start Commands

```bash
# Database is already migrated and ready

# Start development server
npm run dev

# Open Prisma Studio to manage data
npx prisma studio

# Reset database if needed
npx prisma migrate reset

# View current schema
npx prisma format
```

## 📊 Current Database State

After the migration, your database has:
- **30 Courses** (all Digital Renaissance programs)
- **6 Users** (1 teacher, 5 students)
- All users currently have `status: ACTIVE` (update seed to use PENDING)

## 🔐 Security Checklist

- [ ] Hash passwords with bcrypt (minimum 10 rounds)
- [ ] Implement JWT or session-based auth
- [ ] Add CSRF protection
- [ ] Validate file uploads (type, size)
- [ ] Sanitize user inputs
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Add audit logging for admin actions

## 📱 Mobile Considerations

The DR color scheme works great on mobile:
- Monochromatic blocks are responsive
- Touch-friendly buttons (48px minimum)
- Chat optimized for mobile screens

## 🎨 DR Brand Guidelines for New Features

### Chat UI
- Use monochromatic sections
- Messages: Black text on white, or white on black
- Send button: DR Yellow
- Different rooms: Different DR colors (Blue, Peach, Purple)

### Document Upload
- Upload area: Dashed border (black)
- Document cards: Solid DR colors
- Icons: Keep monochromatic

### Admin Dashboard
- Tables: Black borders, white background
- Action buttons: DR color variants
- Stats cards: Each card a different DR color

## 🚀 Next Steps

1. **Implement Authentication**
   - Registration with role selection
   - Login with status validation
   - Protected routes

2. **Build Admin Dashboard**
   - User approval interface
   - System overview
   - Document management

3. **Create Role-Specific Dashboards**
   - Student view
   - Teacher view
   - Admin view

4. **Implement Chat System**
   - Group chats for courses
   - Private messaging
   - Admin announcements

5. **Add Document Upload**
   - File storage setup
   - Upload interface
   - Admin review system

## 📚 Resources

- Prisma Docs: https://www.prisma.io/docs
- NextAuth.js: https://next-auth.js.org
- Pusher (Real-time): https://pusher.com
- Supabase Storage: https://supabase.com/docs/guides/storage

## 💬 Need Help?

This is a comprehensive system. Implement features incrementally:
1. Start with authentication
2. Add admin approval
3. Build dashboards
4. Implement chat
5. Add documents

Each phase builds on the previous one.

---

**The foundation is ready. The database schema supports all these features. Now it's time to build the interfaces!** 🎓
