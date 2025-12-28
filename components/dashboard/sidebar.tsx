'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  userRole?: 'STUDENT' | 'TEACHER' | 'ADMINISTRATOR'
}

export function Sidebar({ userRole = 'STUDENT' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/courses', label: 'My Courses', icon: '📚' },
    { href: '/dashboard/practice', label: 'Practice Log', icon: '🎵' },
    { href: '/dashboard/schedule', label: 'Schedule', icon: '📅' },
    { href: '/dashboard/library', label: 'Music Library', icon: '🎼' },
    { href: '/dashboard/assignments', label: 'Assignments', icon: '📝' },
    { href: '/dashboard/progress', label: 'Progress', icon: '📊' },
  ]

  const teacherLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/classes', label: 'My Classes', icon: '👥' },
    { href: '/dashboard/students', label: 'Students', icon: '🎓' },
    { href: '/dashboard/schedule', label: 'Schedule', icon: '📅' },
    { href: '/dashboard/materials', label: 'Materials', icon: '📚' },
    { href: '/dashboard/assignments', label: 'Assignments', icon: '📝' },
  ]

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/courses', label: 'Courses', icon: '📚' },
    { href: '/admin/documents', label: 'Documents', icon: '📄' },
  ]

  const links =
    userRole === 'ADMINISTRATOR'
      ? adminLinks
      : userRole === 'TEACHER'
      ? teacherLinks
      : studentLinks

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo & Toggle */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h1 className="font-semibold text-lg text-dr-black">
                Digital Renaissance
              </h1>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-dr-black transition-colors p-1 rounded-lg hover:bg-gray-100"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="py-4 px-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all ${
                isActive(link.href)
                  ? 'bg-dr-yellow text-dr-black shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-dr-black'
              }`}
            >
              <span className="text-xl" aria-hidden="true">
                {link.icon}
              </span>
              {!isCollapsed && (
                <span className="font-semibold text-sm">
                  {link.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Section - User Role Badge */}
        <div className="absolute bottom-0 w-full border-t border-gray-100 p-4">
          {!isCollapsed && (
            <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {userRole}
              </p>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <span className="text-xl" aria-label={userRole}>
                {userRole === 'ADMINISTRATOR'
                  ? '👑'
                  : userRole === 'TEACHER'
                  ? '👨‍🏫'
                  : '🎓'}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Spacer */}
      <div className={`${isCollapsed ? 'w-20' : 'w-64'} shrink-0`} />
    </>
  )
}
