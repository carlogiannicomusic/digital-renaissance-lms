'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { CheckCircle, XCircle, Mail, Phone, Calendar, UserCircle, Plus } from 'lucide-react'
import { toast } from 'sonner'

const colorsByRole: Record<string, string> = {
  STUDENT: 'bg-dr-yellow',
  TEACHER: 'bg-dr-blue',
  ADMINISTRATOR: 'bg-dr-purple',
}

export default function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch pending users from API
  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch('/api/users/pending')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setPendingUsers(data)
    } catch (error) {
      toast.error('FAILED TO LOAD PENDING USERS')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (userId: number | string, userName: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/approve`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        throw new Error('Failed to approve user')
      }

      // Remove user from pending list
      setPendingUsers(users => users.filter(u => u.id !== userId))
      toast.success(`${userName.toUpperCase()} APPROVED!`)
    } catch (error) {
      toast.error('FAILED TO APPROVE USER')
    }
  }

  const handleReject = async (userId: number | string, userName: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/reject`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to reject user')
      }

      // Remove user from pending list
      setPendingUsers(users => users.filter(u => u.id !== userId))
      toast.error(`${userName.toUpperCase()} REJECTED`)
    } catch (error) {
      toast.error('FAILED TO REJECT USER')
    }
  }

  const handleBulkApprove = async (role: string) => {
    const filtered = pendingUsers.filter(u => u.role === role)
    const count = filtered.length

    // Approve all users with this role
    await Promise.all(
      filtered.map(user =>
        fetch(`/api/users/${user.id}/approve`, { method: 'PATCH' })
      )
    )

    setPendingUsers(users => users.filter(u => u.role !== role))
    toast.success(`${count} ${role}S APPROVED!`)
  }

  const handleBulkReject = async () => {
    const count = pendingUsers.length

    // Reject all users
    await Promise.all(
      pendingUsers.map(user =>
        fetch(`/api/users/${user.id}/reject`, { method: 'DELETE' })
      )
    )

    setPendingUsers([])
    toast.error(`${count} USERS REJECTED`)
  }

  return (
    <div className="min-h-screen bg-dr-white">
      <header className="bg-dr-black border-b-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/dashboard" className="text-dr-yellow hover:text-dr-white text-sm font-bold uppercase mb-2 block transition-colors">
                ← BACK TO DASHBOARD
              </Link>
              <h1 className="font-display text-2xl md:text-3xl text-dr-yellow uppercase tracking-tight">
                PENDING USER APPROVALS
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/users/new">
                <Button variant="yellow" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  CREATE NEW USER
                </Button>
              </Link>
              <div className="bg-dr-peach border-4 border-dr-yellow px-6 py-3">
                <p className="font-display text-2xl text-dr-black">{pendingUsers.length}</p>
                <p className="text-xs font-bold text-dr-black uppercase">PENDING</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SlideUp>
        <section className="bg-dr-peach border-b-4 border-dr-black py-12">
          <div className="max-w-[1800px] mx-auto px-8 md:px-16">
            <h2 className="font-display text-3xl text-dr-black mb-6 uppercase">REVIEW APPLICATIONS</h2>
            <p className="font-bold text-dr-black mb-8">
              Review and approve or reject user applications. Approved users will receive access credentials via email.
            </p>

            {isLoading ? (
              <div className="bg-dr-white border-4 border-dr-black p-12 text-center">
                <p className="font-display text-2xl text-dr-black uppercase">LOADING PENDING USERS...</p>
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="bg-dr-white border-4 border-dr-black p-12 text-center">
                <p className="font-display text-2xl text-dr-black uppercase mb-4">NO PENDING USERS</p>
                <p className="font-bold text-dr-black">All user applications have been processed.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingUsers.map((user, idx) => (
                  <ScaleIn key={user.id} delay={idx * 0.05}>
                    <div className="bg-dr-white border-4 border-dr-black p-6 hover:border-dr-yellow transition-all">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`${colorsByRole[user.role] || 'bg-dr-yellow'} border-2 border-dr-black p-3`}>
                              <UserCircle className="h-6 w-6 text-dr-black" />
                            </div>
                            <div>
                              <h3 className="font-display text-xl text-dr-black uppercase">
                                {user.name}
                              </h3>
                              <div className="bg-dr-black border-2 border-dr-black px-3 py-1 inline-block mt-1">
                                <p className="text-xs font-bold text-dr-white uppercase">{user.role}</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-dr-black" />
                              <p className="text-sm font-bold text-dr-black">{user.email}</p>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-dr-black" />
                                <p className="text-sm font-bold text-dr-black">{user.phone}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-dr-black" />
                              <p className="text-sm font-bold text-dr-black">
                                APPLIED: {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                      <div className="flex gap-3">
                        <Button variant="green" size="lg" onClick={() => handleApprove(user.id, user.name)}>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          APPROVE
                        </Button>
                        <Button variant="peach" size="lg" onClick={() => handleReject(user.id, user.name)}>
                          <XCircle className="h-5 w-5 mr-2" />
                          REJECT
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScaleIn>
              ))}
            </div>
            )}
          </div>
        </section>
      </SlideUp>

      <section className="bg-dr-yellow border-b-4 border-dr-black py-12">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16">
          <h2 className="font-display text-3xl text-dr-black mb-6 uppercase">BULK ACTIONS</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Button
              variant="green"
              size="lg"
              className="w-full"
              onClick={() => handleBulkApprove('STUDENT')}
              disabled={!pendingUsers.some(u => u.role === 'STUDENT')}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              APPROVE ALL STUDENTS
            </Button>
            <Button
              variant="blue"
              size="lg"
              className="w-full"
              onClick={() => handleBulkApprove('TEACHER')}
              disabled={!pendingUsers.some(u => u.role === 'TEACHER')}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              APPROVE ALL TEACHERS
            </Button>
            <Button
              variant="peach"
              size="lg"
              className="w-full"
              onClick={handleBulkReject}
              disabled={pendingUsers.length === 0}
            >
              <XCircle className="h-5 w-5 mr-2" />
              REJECT ALL
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-dr-black border-t-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-8">
          <p className="font-display text-sm text-dr-white uppercase text-center">
            © 2024 DIGITAL RENAISSANCE INSTITUTE • (555) 123-4567
          </p>
        </div>
      </footer>
    </div>
  )
}
