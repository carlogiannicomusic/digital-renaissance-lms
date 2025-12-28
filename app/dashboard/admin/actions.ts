'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function handleLogout() {
  // Clear the session cookie
  const cookieStore = await cookies()
  cookieStore.delete('next-auth.session-token')
  cookieStore.delete('__Secure-next-auth.session-token')

  redirect('/')
}
