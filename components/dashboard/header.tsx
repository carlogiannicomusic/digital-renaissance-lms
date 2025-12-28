'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  userName?: string
  userEmail?: string
  notificationCount?: number
}

export function DashboardHeader({
  userName = 'Student',
  userEmail = 'student@digitalrenaissance.ae',
  notificationCount = 0,
}: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const mockNotifications = [
    { id: 1, message: 'New assignment: Music Theory Quiz 3', time: '2 hours ago' },
    { id: 2, message: 'Live lesson starts in 30 minutes', time: '4 hours ago' },
    {
      id: 3,
      message: 'Your recording submission was reviewed',
      time: '1 day ago',
    },
  ]

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 backdrop-blur-lg bg-opacity-90">
      <div className="flex items-center justify-between px-8 py-3">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search songs, lessons, or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm text-dr-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dr-yellow focus:border-transparent transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Right Section: Notifications & Profile */}
        <div className="flex items-center gap-3 ml-8">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowProfileMenu(false)
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <span className="text-xl">🔔</span>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-dr-peach text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-sm text-dr-black">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <p className="text-sm font-medium text-dr-black">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-100">
                    <Link
                      href="/dashboard/notifications"
                      className="text-sm font-semibold text-dr-blue hover:text-dr-purple transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu)
                setShowNotifications(false)
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-dr-purple to-dr-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-sm text-dr-black hidden md:block">
                {userName}
              </span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-sm text-dr-black">{userName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{userEmail}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>👤</span> My Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>⚙️</span> Settings
                    </Link>
                    <Link
                      href="/dashboard/help"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>❓</span> Help & Support
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 p-2">
                    <button className="w-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left flex items-center gap-2">
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
