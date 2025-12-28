'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { Plus, CheckCircle, XCircle } from 'lucide-react'

export default function RoomsManagement() {
  const rooms = [
    { id: 1, name: 'Studio 1', capacity: 12, equipment: ['Piano', 'Sound System', 'Microphones'], available: true, bookings: 5 },
    { id: 2, name: 'Studio 2', capacity: 8, equipment: ['Guitar Amps', 'Drum Kit', 'Recording'], available: false, bookings: 7 },
    { id: 3, name: 'Studio 3', capacity: 2, equipment: ['Piano', 'Vocal Booth'], available: true, bookings: 8 },
    { id: 4, name: 'Production Lab', capacity: 6, equipment: ['DJ Decks', 'Ableton', 'Controllers'], available: true, bookings: 4 },
    { id: 5, name: 'Room 201', capacity: 20, equipment: ['Projector', 'Whiteboard', 'Chairs'], available: true, bookings: 3 },
  ]

  return (
    <div className="min-h-screen bg-dr-white">
      <Header
        title="ROOMS & RESOURCES"
        backLink="/dashboard"
        backText="BACK TO DASHBOARD"
        variant="black"
        actions={
          <Button variant="yellow" size="lg">
            <Plus className="mr-2" size={20} />
            ADD ROOM
          </Button>
        }
      />

      <SlideUp>
        <section className="bg-dr-green border-b-4 border-dr-black">
          <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-dr-white border-4 border-dr-black p-6">
                <p className="text-sm font-bold uppercase text-dr-black mb-2">TOTAL ROOMS</p>
                <p className="text-5xl font-display text-dr-black">8</p>
              </div>
              <div className="bg-dr-white border-4 border-dr-black p-6">
                <p className="text-sm font-bold uppercase text-dr-black mb-2">AVAILABLE NOW</p>
                <p className="text-5xl font-display text-dr-green">5</p>
              </div>
              <div className="bg-dr-white border-4 border-dr-black p-6">
                <p className="text-sm font-bold uppercase text-dr-black mb-2">IN USE</p>
                <p className="text-5xl font-display text-dr-peach">3</p>
              </div>
              <div className="bg-dr-white border-4 border-dr-black p-6">
                <p className="text-sm font-bold uppercase text-dr-black mb-2">BOOKINGS TODAY</p>
                <p className="text-5xl font-display text-dr-black">23</p>
              </div>
            </div>
          </div>
        </section>
      </SlideUp>

      <section className="max-w-[1800px] mx-auto px-8 md:px-16 py-12">
        <h2 className="font-display text-2xl text-dr-black mb-6 uppercase">ALL ROOMS</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {rooms.map((room, index) => (
            <ScaleIn key={room.id} delay={index * 0.1}>
              <div className="bg-dr-white border-4 border-dr-black p-6 hover:border-dr-green transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display text-2xl text-dr-black uppercase mb-2">{room.name}</h3>
                    <p className="text-sm font-bold text-dr-black">Capacity: {room.capacity} people</p>
                  </div>
                  {room.available ? (
                    <div className="flex items-center gap-2 bg-dr-green px-3 py-1">
                      <CheckCircle size={16} className="text-dr-white" />
                      <span className="text-xs font-bold uppercase text-dr-white">AVAILABLE</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-dr-peach px-3 py-1">
                      <XCircle size={16} className="text-dr-white" />
                      <span className="text-xs font-bold uppercase text-dr-white">IN USE</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-xs font-bold uppercase text-dr-black mb-2">EQUIPMENT</p>
                  <div className="flex flex-wrap gap-2">
                    {room.equipment.map((item, i) => (
                      <span key={i} className="bg-dr-yellow border-2 border-dr-black px-3 py-1 text-xs font-bold">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-dr-black">
                  <p className="text-sm font-bold text-dr-black">
                    {room.bookings} bookings today
                  </p>
                </div>
              </div>
            </ScaleIn>
          ))}
        </div>
      </section>

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
