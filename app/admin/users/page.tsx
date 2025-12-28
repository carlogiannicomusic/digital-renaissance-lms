import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { UserTable } from '@/components/admin/user-table'
import { prisma } from '@/lib/db/prisma'

async function getUsers(status?: string, role?: string) {
  try {
    const where: any = {}
    if (status) where.status = status
    if (role) where.role = role

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            coursesTeaching: true,
            documents: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return users.map(user => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; role?: string }>
}) {
  const params = await searchParams
  const users = await getUsers(params.status, params.role)

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header - Purple */}
      <section className="bg-dr-purple border-b-4 border-dr-black">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-8">
          <div className="flex justify-between items-start mb-8">
            {/* Logo */}
            <Link href="/dashboard" className="block hover:opacity-80 transition-opacity">
              <Image
                src="/logo-black.svg"
                alt="Digital Renaissance Institute for Creative Arts"
                width={250}
                height={60}
                priority
                className="h-12 w-auto"
              />
            </Link>

            {/* Back Button */}
            <Link href="/dashboard">
              <Button variant="black" size="sm">
                ← Dashboard
              </Button>
            </Link>
          </div>

          {/* Title */}
          <div>
            <h1 className="font-display text-5xl md:text-6xl text-dr-black mb-4 uppercase">
              USER MANAGEMENT
            </h1>
            <p className="text-lg text-dr-black font-semibold">
              Review, approve, and manage all users
            </p>
          </div>
        </div>
      </section>

      {/* Filters - Black */}
      <section className="bg-dr-black">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-dr-white mb-2">
                FILTER BY STATUS
              </p>
              <div className="flex gap-2">
                <Link href="/admin/users">
                  <Button
                    variant={!params.status ? 'yellow' : 'white'}
                    size="sm"
                  >
                    All
                  </Button>
                </Link>
                <Link href="/admin/users?status=PENDING">
                  <Button
                    variant={params.status === 'PENDING' ? 'yellow' : 'white'}
                    size="sm"
                  >
                    Pending
                  </Button>
                </Link>
                <Link href="/admin/users?status=ACTIVE">
                  <Button
                    variant={params.status === 'ACTIVE' ? 'green' : 'white'}
                    size="sm"
                  >
                    Active
                  </Button>
                </Link>
                <Link href="/admin/users?status=INACTIVE">
                  <Button
                    variant={params.status === 'INACTIVE' ? 'peach' : 'white'}
                    size="sm"
                  >
                    Inactive
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-dr-white mb-2">
                FILTER BY ROLE
              </p>
              <div className="flex gap-2">
                <Link href="/admin/users">
                  <Button
                    variant={!params.role ? 'blue' : 'white'}
                    size="sm"
                  >
                    All
                  </Button>
                </Link>
                <Link href="/admin/users?role=STUDENT">
                  <Button
                    variant={params.role === 'STUDENT' ? 'blue' : 'white'}
                    size="sm"
                  >
                    Students
                  </Button>
                </Link>
                <Link href="/admin/users?role=TEACHER">
                  <Button
                    variant={params.role === 'TEACHER' ? 'blue' : 'white'}
                    size="sm"
                  >
                    Teachers
                  </Button>
                </Link>
                <Link href="/admin/users?role=ADMINISTRATOR">
                  <Button
                    variant={params.role === 'ADMINISTRATOR' ? 'blue' : 'white'}
                    size="sm"
                  >
                    Admins
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Table */}
      <section className="max-w-7xl mx-auto px-8 md:px-16 py-16">
        <UserTable users={users} currentStatus={params.status} currentRole={params.role} />
      </section>

      {/* Footer */}
      <section className="bg-dr-black py-12">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <p className="font-display text-sm text-dr-white">
            DIGITAL RENAISSANCE - USER MANAGEMENT
          </p>
        </div>
      </section>
    </div>
  )
}
