'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { Users, ArrowLeft, Mail, Phone, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  email: string
  phone: string | null
  enrolledAt: string
}

interface Course {
  id: string
  title: string
  description: string | null
  teacher: {
    name: string
  }
}

export default function CourseRosterPage() {
  const params = useParams()
  const { data: session } = useSession()
  const courseId = params.id as string

  const [students, setStudents] = useState<Student[]>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRoster()
  }, [courseId])

  const fetchRoster = async () => {
    try {
      setIsLoading(true)

      // Fetch course details
      const courseRes = await fetch(`/api/courses/${courseId}`)
      if (courseRes.ok) {
        const courseData = await courseRes.json()
        setCourse(courseData)

        // Fetch enrollments
        const enrollmentsRes = await fetch(`/api/enrollments?courseId=${courseId}`)
        if (enrollmentsRes.ok) {
          const enrollments = await enrollmentsRes.json()
          setStudents(enrollments)
        } else {
          toast.error('FAILED TO LOAD ROSTER')
        }
      }
    } catch (error) {
      toast.error('ERROR LOADING ROSTER')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header - Blue */}
      <header className="bg-dr-blue border-b-4 border-dr-black">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href={`/courses/${courseId}`}>
                <Button variant="white" size="sm">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  BACK TO COURSE
                </Button>
              </Link>
              <div>
                <h1 className="font-display text-2xl md:text-3xl text-dr-white uppercase tracking-tight">
                  CLASS ROSTER
                </h1>
                {course && (
                  <p className="text-dr-white text-sm font-bold">
                    {course.title} - {course.teacher.name}
                  </p>
                )}
              </div>
            </div>
            <div className="bg-dr-white border-2 border-dr-black px-6 py-3">
              <p className="font-display text-3xl text-dr-black">
                {students.length}
              </p>
              <p className="text-xs font-bold uppercase text-dr-black">
                ENROLLED STUDENTS
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-12">
        {isLoading ? (
          <div className="bg-dr-yellow border-4 border-dr-black p-12 text-center">
            <p className="font-display text-2xl text-dr-black uppercase">
              LOADING ROSTER...
            </p>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-dr-white border-4 border-dr-black p-12 text-center">
            <Users className="h-16 w-16 text-dr-black mx-auto mb-4" />
            <p className="font-display text-2xl text-dr-black uppercase">
              NO STUDENTS ENROLLED YET
            </p>
            <p className="font-bold text-dr-black mt-2">
              Students will appear here once they enroll in this course
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student, idx) => (
              <ScaleIn key={student.id} delay={idx * 0.05}>
                <div className="bg-dr-yellow border-4 border-dr-black p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-display text-2xl text-dr-black uppercase mb-2">
                        {student.name}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-dr-black font-bold">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${student.email}`} className="hover:underline">
                            {student.email}
                          </a>
                        </div>
                        {student.phone && (
                          <div className="flex items-center gap-2 text-dr-black font-bold">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${student.phone}`} className="hover:underline">
                              {student.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-dr-black font-bold">
                          <Calendar className="h-4 w-4" />
                          <span>Enrolled: {new Date(student.enrolledAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={`mailto:${student.email}`}>
                        <Button variant="black" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          EMAIL STUDENT
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </ScaleIn>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
