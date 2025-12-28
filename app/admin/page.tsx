'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/admin/stat-card'
import { toast } from 'sonner'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { UserCheck, UserX, Mail, Phone, Calendar, Edit, UserPlus } from 'lucide-react'

type Stats = {
  users: {
    total: number
    pending: number
    active: number
    inactive: number
    byRole: {
      students: number
      teachers: number
      administrators: number
    }
  }
  courses: { total: number }
  enrollments: { total: number }
  documents: { total: number }
} | null

type PendingUser = {
  id: string
  name: string
  email: string
  role: string
  phone?: string | null
  createdAt: string
}

type User = {
  id: string
  name: string
  email: string
  role: string
  status: string
  phone?: string | null
  createdAt: string
  _count?: {
    enrollments: number
    coursesTeaching: number
    documents: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(null)
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Filter users based on status and role
    let filtered = allUsers

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(u => u.status === statusFilter)
    }

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(u => u.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [allUsers, statusFilter, roleFilter])

  const fetchData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      // Fetch pending users
      const pendingRes = await fetch('/api/users/pending')
      if (pendingRes.ok) {
        const pendingData = await pendingRes.json()
        setPendingUsers(pendingData)
      }

      // Fetch all users
      const usersRes = await fetch('/api/users')
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setAllUsers(usersData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (userId: string, userName: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/approve`, {
        method: 'PATCH',
      })

      if (res.ok) {
        toast.success(`${userName.toUpperCase()} APPROVED`)
        setPendingUsers(prev => prev.filter(u => u.id !== userId))
        fetchData() // Refresh stats
      } else {
        toast.error('FAILED TO APPROVE USER')
      }
    } catch (error) {
      toast.error('AN ERROR OCCURRED')
    }
  }

  const handleReject = async (userId: string, userName: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/reject`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success(`${userName.toUpperCase()} REJECTED`)
        setPendingUsers(prev => prev.filter(u => u.id !== userId))
        fetchData() // Refresh stats
      } else {
        toast.error('FAILED TO REJECT USER')
      }
    } catch (error) {
      toast.error('AN ERROR OCCURRED')
    }
  }

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header - Yellow */}
      <section className="bg-dr-yellow">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="font-display text-5xl md:text-6xl text-dr-black mb-4">
                ADMIN DASHBOARD
              </h1>
              <p className="text-lg text-dr-black font-semibold">
                System Management & Overview
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="black" size="sm">
                ← DASHBOARD
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions - Black */}
      <section className="bg-dr-black">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-12">
          <h2 className="font-display text-2xl text-dr-white mb-6">
            QUICK ACTIONS
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/admin/users?status=PENDING">
              <Button variant="yellow" className="w-full">
                Pending Approvals
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="blue" className="w-full">
                Manage Users
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="peach" className="w-full">
                View Courses
              </Button>
            </Link>
            <Link href="/admin/documents">
              <Button variant="purple" className="w-full">
                Review Documents
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Grid */}
      {stats && (
        <section className="max-w-7xl mx-auto px-8 md:px-16 py-16">
          <h2 className="font-display text-3xl text-dr-black mb-8">
            SYSTEM STATISTICS
          </h2>

          {/* User Stats */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-dr-black mb-4 uppercase">
              Users
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <StatCard
                title="Total Users"
                value={stats.users.total}
                color="blue"
              />
              <StatCard
                title="Pending Approval"
                value={stats.users.pending}
                description="Awaiting review"
                color="yellow"
              />
              <StatCard
                title="Active Users"
                value={stats.users.active}
                color="green"
              />
              <StatCard
                title="Inactive"
                value={stats.users.inactive}
                color="peach"
              />
            </div>
          </div>

          {/* Role Distribution */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-dr-black mb-4 uppercase">
              By Role
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <StatCard
                title="Students"
                value={stats.users.byRole.students}
                color="purple"
              />
              <StatCard
                title="Teachers"
                value={stats.users.byRole.teachers}
                color="blue"
              />
              <StatCard
                title="Administrators"
                value={stats.users.byRole.administrators}
                color="peach"
              />
            </div>
          </div>

          {/* System Stats */}
          <div>
            <h3 className="text-xl font-bold text-dr-black mb-4 uppercase">
              System Overview
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <StatCard
                title="Total Courses"
                value={stats.courses.total}
                color="yellow"
              />
              <StatCard
                title="Total Enrollments"
                value={stats.enrollments.total}
                color="green"
              />
              <StatCard
                title="Documents Uploaded"
                value={stats.documents.total}
                color="blue"
              />
            </div>
          </div>
        </section>
      )}

      {/* Pending User Requests */}
      {pendingUsers.length > 0 && (
        <SlideUp>
          <section className="max-w-7xl mx-auto px-8 md:px-16 py-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-display text-3xl text-dr-black uppercase">
                PENDING STUDENT REQUESTS ({pendingUsers.length})
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {pendingUsers.map((user, idx) => (
                <div key={user.id}>
                  <ScaleIn delay={idx * 0.05}>
                    <div className="bg-dr-peach border-4 border-dr-black p-6">
                    {/* User Info */}
                    <div className="mb-6">
                      <h3 className="font-display text-2xl text-dr-black uppercase mb-3">
                        {user.name}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-dr-black font-bold">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-dr-black font-bold">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-dr-black font-bold">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Registered: {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="px-3 py-1 bg-dr-black text-dr-white font-bold text-sm uppercase">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        variant="green"
                        className="flex-1 flex items-center justify-center gap-2"
                        onClick={() => handleApprove(user.id, user.name)}
                      >
                        <UserCheck className="w-5 h-5" />
                        APPROVE
                      </Button>
                      <Button
                        variant="black"
                        className="flex-1 flex items-center justify-center gap-2"
                        onClick={() => handleReject(user.id, user.name)}
                      >
                        <UserX className="w-5 h-5" />
                        REJECT
                      </Button>
                    </div>
                    </div>
                  </ScaleIn>
                </div>
              ))}
            </div>
          </section>
        </SlideUp>
      )}

      {/* User Management Section */}
      <SlideUp>
        <section className="max-w-7xl mx-auto px-8 md:px-16 py-16">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h2 className="font-display text-4xl text-dr-black uppercase mb-2">
                USER MANAGEMENT
              </h2>
              <p className="text-lg text-dr-black font-semibold">
                Review, approve, and manage all users
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/users/invite">
                <Button variant="green">
                  <Mail className="w-5 h-5 mr-2" />
                  SEND INVITE
                </Button>
              </Link>
              <Link href="/admin/users/new">
                <Button variant="yellow">
                  <UserPlus className="w-5 h-5 mr-2" />
                  CREATE USER
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-dr-black border-4 border-dr-black p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Status Filter */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-dr-yellow mb-3">
                  FILTER BY STATUS
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={statusFilter === 'ALL' ? 'yellow' : 'white'}
                    size="sm"
                    onClick={() => setStatusFilter('ALL')}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === 'PENDING' ? 'yellow' : 'white'}
                    size="sm"
                    onClick={() => setStatusFilter('PENDING')}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={statusFilter === 'ACTIVE' ? 'yellow' : 'white'}
                    size="sm"
                    onClick={() => setStatusFilter('ACTIVE')}
                  >
                    Active
                  </Button>
                  <Button
                    variant={statusFilter === 'INACTIVE' ? 'yellow' : 'white'}
                    size="sm"
                    onClick={() => setStatusFilter('INACTIVE')}
                  >
                    Inactive
                  </Button>
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-dr-yellow mb-3">
                  FILTER BY ROLE
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={roleFilter === 'ALL' ? 'yellow' : 'white'}
                    size="sm"
                    onClick={() => setRoleFilter('ALL')}
                  >
                    All
                  </Button>
                  <Button
                    variant={roleFilter === 'STUDENT' ? 'yellow' : 'white'}
                    size="sm"
                    onClick={() => setRoleFilter('STUDENT')}
                  >
                    Students
                  </Button>
                  <Button
                    variant={roleFilter === 'TEACHER' ? 'yellow' : 'white'}
                    size="sm"
                    onClick={() => setRoleFilter('TEACHER')}
                  >
                    Teachers
                  </Button>
                  <Button
                    variant={roleFilter === 'ADMINISTRATOR' ? 'yellow' : 'white'}
                    size="sm"
                    onClick={() => setRoleFilter('ADMINISTRATOR')}
                  >
                    Admins
                  </Button>
                </div>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="mt-4 pt-4 border-t-2 border-dr-yellow">
              <p className="text-dr-white font-bold">
                Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                {statusFilter !== 'ALL' && ` • Status: ${statusFilter}`}
                {roleFilter !== 'ALL' && ` • Role: ${roleFilter}`}
              </p>
            </div>
          </div>

          {/* Users Table */}
          {filteredUsers.length > 0 ? (
            <div className="bg-dr-white border-4 border-dr-black overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dr-black">
                    <tr>
                      <th className="px-6 py-4 text-left font-display text-sm text-dr-yellow uppercase">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left font-display text-sm text-dr-yellow uppercase">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left font-display text-sm text-dr-yellow uppercase">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left font-display text-sm text-dr-yellow uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left font-display text-sm text-dr-yellow uppercase">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-center font-display text-sm text-dr-yellow uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, idx) => (
                      <tr
                        key={user.id}
                        className={`border-t-4 border-dr-black ${
                          idx % 2 === 0 ? 'bg-dr-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-dr-black">{user.name}</div>
                          {user.phone && (
                            <div className="text-sm text-gray-600">{user.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-dr-black font-semibold">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-dr-blue text-dr-white font-bold text-xs uppercase border-2 border-dr-black">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 font-bold text-xs uppercase border-2 border-dr-black ${
                              user.status === 'ACTIVE'
                                ? 'bg-dr-green text-dr-white'
                                : user.status === 'PENDING'
                                ? 'bg-dr-yellow text-dr-black'
                                : 'bg-dr-peach text-dr-white'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-dr-black font-bold">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            {user.status === 'PENDING' && (
                              <>
                                <Button
                                  variant="green"
                                  size="sm"
                                  onClick={() => handleApprove(user.id, user.name)}
                                  title="Approve User"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="black"
                                  size="sm"
                                  onClick={() => handleReject(user.id, user.name)}
                                  title="Reject User"
                                >
                                  <UserX className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Link href={`/admin/users/${user.id}/edit`}>
                              <Button
                                variant="yellow"
                                size="sm"
                                title="Edit User & Documents"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-dr-white border-4 border-dr-black p-12 text-center">
              <p className="font-display text-xl text-dr-black uppercase">
                NO USERS FOUND
              </p>
              <p className="text-dr-black mt-2">
                Try adjusting your filters
              </p>
            </div>
          )}
        </section>
      </SlideUp>

      {/* Footer */}
      <section className="bg-dr-black py-12">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <p className="font-display text-sm text-dr-white">
            DIGITAL RENAISSANCE - ADMIN PANEL
          </p>
        </div>
      </section>
    </div>
  )
}
