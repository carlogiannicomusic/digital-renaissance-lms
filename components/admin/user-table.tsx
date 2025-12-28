'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'STUDENT' | 'TEACHER' | 'ADMINISTRATOR'
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
  createdAt: string
  _count: {
    enrollments: number
    coursesTeaching: number
    documents: number
  }
}

interface UserTableProps {
  users: User[]
  currentStatus?: string
  currentRole?: string
}

export function UserTable({ users, currentStatus, currentRole }: UserTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (userId: string) => {
    if (!confirm('Are you sure you want to approve this user?')) return

    setLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'PATCH',
      })

      if (!res.ok) {
        throw new Error('Failed to approve user')
      }

      router.refresh()
    } catch (error) {
      alert('Failed to approve user. Please try again.')
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to set this user's status to ${newStatus}?`))
      return

    setLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error('Failed to update user status')
      }

      router.refresh()
    } catch (error) {
      alert('Failed to update user status. Please try again.')
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return 'text-dr-purple'
      case 'TEACHER':
        return 'text-dr-blue'
      case 'ADMINISTRATOR':
        return 'text-dr-peach'
      default:
        return 'text-dr-black'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-dr-yellow text-dr-black'
      case 'ACTIVE':
        return 'bg-dr-green text-dr-white'
      case 'INACTIVE':
        return 'bg-dr-peach text-dr-black'
      default:
        return 'bg-dr-white text-dr-black'
    }
  }

  if (users.length === 0) {
    return (
      <div className="bg-dr-yellow p-16 text-center">
        <p className="font-display text-2xl text-dr-black">
          NO USERS FOUND
        </p>
        <p className="text-lg text-dr-black mt-4">
          {currentStatus || currentRole
            ? 'Try adjusting your filters'
            : 'No users in the system yet'}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-2 border-dr-black">
        <thead className="bg-dr-black text-dr-white">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide">
              Role
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide">
              Activity
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={`border-t-2 border-dr-black ${
                index % 2 === 0 ? 'bg-dr-white' : 'bg-gray-50'
              }`}
            >
              <td className="px-6 py-4">
                <p className="font-bold text-dr-black">{user.name}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </td>
              <td className="px-6 py-4 text-sm text-dr-black">{user.email}</td>
              <td className="px-6 py-4">
                <span className={`font-bold uppercase text-sm ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 text-xs font-bold uppercase ${getStatusColor(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-dr-black">
                {user.role === 'STUDENT' && (
                  <p>
                    {user._count.enrollments} enrollment
                    {user._count.enrollments !== 1 ? 's' : ''}
                  </p>
                )}
                {user.role === 'TEACHER' && (
                  <p>
                    {user._count.coursesTeaching} course
                    {user._count.coursesTeaching !== 1 ? 's' : ''}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  {user._count.documents} document
                  {user._count.documents !== 1 ? 's' : ''}
                </p>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-2">
                  {user.status === 'PENDING' ? (
                    <>
                      <Button
                        variant="green"
                        size="sm"
                        onClick={() => handleApprove(user.id)}
                        disabled={loading === user.id}
                      >
                        {loading === user.id ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button
                        variant="peach"
                        size="sm"
                        onClick={() => handleStatusChange(user.id, 'INACTIVE')}
                        disabled={loading === user.id}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <>
                      {user.status === 'ACTIVE' && (
                        <Button
                          variant="peach"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'INACTIVE')}
                          disabled={loading === user.id}
                        >
                          Deactivate
                        </Button>
                      )}
                      {user.status === 'INACTIVE' && (
                        <Button
                          variant="green"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                          disabled={loading === user.id}
                        >
                          Activate
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
