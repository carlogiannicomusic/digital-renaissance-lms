import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Redirect based on role
  if (session.user.role === 'ADMINISTRATOR') {
    redirect('/dashboard/admin')
  } else if (session.user.role === 'TEACHER') {
    redirect('/dashboard/teacher')
  } else if (session.user.role === 'STUDENT') {
    redirect('/dashboard/student')
  }

  // Fallback
  redirect('/login')
}
