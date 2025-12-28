'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { BarChart3, TrendingUp, Users, Calendar, FileText, Download } from 'lucide-react'

export default function Reports() {
  const stats = [
    { label: 'Total Revenue', value: '$48,250', change: '+12.5%', color: 'bg-dr-yellow' },
    { label: 'Active Students', value: '156', change: '+8', color: 'bg-dr-blue' },
    { label: 'Classes This Month', value: '342', change: '+23', color: 'bg-dr-purple' },
    { label: 'Teacher Hours', value: '1,248', change: '+156', color: 'bg-dr-green' },
  ]

  const reports = [
    { name: 'Monthly Revenue Report', period: 'January 2024', color: 'bg-dr-yellow', icon: BarChart3 },
    { name: 'Student Enrollment Report', period: 'Q4 2023', color: 'bg-dr-blue', icon: Users },
    { name: 'Class Attendance Report', period: 'This Week', color: 'bg-dr-purple', icon: Calendar },
    { name: 'Teacher Performance Report', period: 'December 2023', color: 'bg-dr-green', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-dr-white">
      <Header
        title="REPORTS & ANALYTICS"
        backLink="/dashboard"
        backText="BACK TO DASHBOARD"
        variant="black"
        actions={
          <Button variant="yellow" size="lg">
            <FileText className="mr-2 h-5 w-5" />
            GENERATE REPORT
          </Button>
        }
      />

      <SlideUp>
        <section className="bg-dr-yellow border-b-4 border-dr-black py-12">
          <div className="max-w-[1800px] mx-auto px-8 md:px-16">
            <h2 className="font-display text-3xl text-dr-black mb-8 uppercase">OVERVIEW</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <ScaleIn key={stat.label} delay={idx * 0.1}>
                  <div className="bg-dr-white border-4 border-dr-black p-6">
                    <p className="text-sm font-bold text-dr-black uppercase mb-2">{stat.label}</p>
                    <p className="font-display text-4xl text-dr-black mb-2">{stat.value}</p>
                    <div className={`${stat.color} border-2 border-dr-black px-3 py-1 inline-block`}>
                      <p className="text-sm font-bold text-dr-black">{stat.change}</p>
                    </div>
                  </div>
                </ScaleIn>
              ))}
            </div>
          </div>
        </section>
      </SlideUp>

      <section className="bg-dr-blue border-b-4 border-dr-black py-12">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16">
          <h2 className="font-display text-3xl text-dr-white mb-8 uppercase">AVAILABLE REPORTS</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {reports.map((report, idx) => (
              <ScaleIn key={report.name} delay={idx * 0.1}>
                <div className="bg-dr-white border-4 border-dr-black p-6 hover:border-dr-yellow transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${report.color} border-2 border-dr-black p-3`}>
                      <report.icon className="h-6 w-6 text-dr-black" />
                    </div>
                    <Button variant="black" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      EXPORT
                    </Button>
                  </div>
                  <h3 className="font-display text-xl text-dr-black uppercase mb-2">
                    {report.name}
                  </h3>
                  <p className="text-sm font-bold text-dr-black opacity-70">{report.period}</p>
                </div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dr-purple border-b-4 border-dr-black py-12">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16">
          <h2 className="font-display text-3xl text-dr-white mb-8 uppercase">CUSTOM REPORTS</h2>
          <div className="bg-dr-white border-4 border-dr-black p-8 max-w-2xl">
            <p className="font-bold text-dr-black mb-6 uppercase">Generate Custom Report</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  REPORT TYPE
                </label>
                <select className="w-full border-4 border-dr-black p-4 font-semibold">
                  <option>Revenue Analysis</option>
                  <option>Student Performance</option>
                  <option>Teacher Utilization</option>
                  <option>Room Usage</option>
                  <option>Class Attendance</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    START DATE
                  </label>
                  <input
                    type="date"
                    className="w-full border-4 border-dr-black p-4 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    END DATE
                  </label>
                  <input
                    type="date"
                    className="w-full border-4 border-dr-black p-4 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  FORMAT
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button className="bg-dr-yellow border-4 border-dr-black p-4 font-bold uppercase hover:bg-dr-black hover:text-dr-yellow transition-all">
                    PDF
                  </button>
                  <button className="bg-dr-white border-4 border-dr-black p-4 font-bold uppercase hover:bg-dr-black hover:text-dr-white transition-all">
                    EXCEL
                  </button>
                  <button className="bg-dr-white border-4 border-dr-black p-4 font-bold uppercase hover:bg-dr-black hover:text-dr-white transition-all">
                    CSV
                  </button>
                </div>
              </div>

              <Button variant="black" size="lg" className="w-full mt-6">
                <Download className="mr-2 h-5 w-5" />
                GENERATE & DOWNLOAD
              </Button>
            </div>
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
