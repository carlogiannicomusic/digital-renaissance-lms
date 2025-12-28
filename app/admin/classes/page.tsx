'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { Plus, Users, User } from 'lucide-react'

export default function ClassesManagement() {
  const classes = [
    { id: 1, name: 'Piano Masterclass', type: 'group', students: 8, teacher: 'Maria Rodriguez', schedule: 'Mon 10:00-11:30' },
    { id: 2, name: 'Music Theory Level 1', type: 'group', students: 12, teacher: 'Prof. Williams', schedule: 'Mon 14:00-15:30' },
    { id: 3, name: 'Private Vocal Lesson', type: 'private', students: 1, teacher: 'Sarah Johnson', schedule: 'Tue 11:00-12:00' },
    { id: 4, name: 'DJ Workshop', type: 'group', students: 6, teacher: 'DJ Marcus Lee', schedule: 'Tue 16:30-18:00' },
    { id: 5, name: 'Guitar Basics', type: 'group', students: 5, teacher: 'Carlos Mendez', schedule: 'Wed 10:00-11:00' },
  ]

  return (
    <div className="min-h-screen bg-dr-white">
      <Header
        title="CLASSES & GROUPS"
        backLink="/dashboard"
        backText="BACK TO DASHBOARD"
        variant="black"
        actions={
          <Button variant="yellow" size="lg">
            <Plus className="mr-2" size={20} />
            CREATE CLASS
          </Button>
        }
      />

      {/* Stats - Yellow */}
      <SlideUp>
        <section className="bg-dr-yellow border-b-4 border-dr-black">
          <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-dr-white border-4 border-dr-black p-6">
                <p className="text-sm font-bold uppercase text-dr-black mb-2">TOTAL GROUPS</p>
                <p className="text-5xl font-display text-dr-black">32</p>
              </div>
              <div className="bg-dr-white border-4 border-dr-black p-6">
                <p className="text-sm font-bold uppercase text-dr-black mb-2">PRIVATE LESSONS</p>
                <p className="text-5xl font-display text-dr-black">45</p>
              </div>
              <div className="bg-dr-white border-4 border-dr-black p-6">
                <p className="text-sm font-bold uppercase text-dr-black mb-2">GROUP CLASSES</p>
                <p className="text-5xl font-display text-dr-black">44</p>
              </div>
              <div className="bg-dr-white border-4 border-dr-black p-6">
                <p className="text-sm font-bold uppercase text-dr-black mb-2">AVG SIZE</p>
                <p className="text-5xl font-display text-dr-black">8</p>
              </div>
            </div>
          </div>
        </section>
      </SlideUp>

      {/* Classes List */}
      <section className="max-w-[1800px] mx-auto px-8 md:px-16 py-12">
        <h2 className="font-display text-2xl text-dr-black mb-6 uppercase">ALL CLASSES</h2>
        <div className="space-y-4">
          {classes.map((cls, index) => (
            <ScaleIn key={cls.id} delay={index * 0.1}>
              <div className="bg-dr-white border-4 border-dr-black p-6 hover:border-dr-blue transition-all cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {cls.type === 'group' ? (
                        <Users size={24} className="text-dr-purple" />
                      ) : (
                        <User size={24} className="text-dr-peach" />
                      )}
                      <h3 className="font-display text-2xl text-dr-black uppercase">{cls.name}</h3>
                    </div>
                    <p className="text-sm font-bold text-dr-black mb-1">Teacher: {cls.teacher}</p>
                    <p className="text-sm font-bold text-gray-600">Schedule: {cls.schedule}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase text-dr-black mb-1">{cls.type}</p>
                    <p className="text-3xl font-display text-dr-purple">{cls.students}</p>
                    <p className="text-xs font-bold text-dr-black">STUDENTS</p>
                  </div>
                </div>
              </div>
            </ScaleIn>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dr-black border-t-4 border-dr-yellow mt-12">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-8">
          <p className="font-display text-sm text-dr-white uppercase text-center">
            © 2024 DIGITAL RENAISSANCE INSTITUTE
          </p>
        </div>
      </footer>
    </div>
  )
}
