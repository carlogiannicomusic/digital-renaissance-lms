'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { Phone, Mail, MessageSquare, FileText, HelpCircle, BookOpen } from 'lucide-react'

export default function Support() {
  const contactMethods = [
    {
      title: 'Phone Support',
      description: 'Call us Monday-Friday, 9AM-6PM EST',
      detail: '(555) 123-4567',
      icon: Phone,
      color: 'bg-dr-yellow'
    },
    {
      title: 'Email Support',
      description: 'Get a response within 24 hours',
      detail: 'support@digitalrenaissance.edu',
      icon: Mail,
      color: 'bg-dr-blue'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      detail: 'Available 9AM-6PM EST',
      icon: MessageSquare,
      color: 'bg-dr-purple'
    }
  ]

  const resources = [
    {
      title: 'Administrator Guide',
      description: 'Complete guide for managing the LMS system',
      color: 'bg-dr-yellow',
      icon: BookOpen
    },
    {
      title: 'User Documentation',
      description: 'Help articles and tutorials for all features',
      color: 'bg-dr-blue',
      icon: FileText
    },
    {
      title: 'FAQ',
      description: 'Frequently asked questions and answers',
      color: 'bg-dr-green',
      icon: HelpCircle
    }
  ]

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
                SUPPORT & HELP
              </h1>
            </div>
          </div>
        </div>
      </header>

      <SlideUp>
        <section className="bg-dr-blue border-b-4 border-dr-black py-12">
          <div className="max-w-[1800px] mx-auto px-8 md:px-16">
            <h2 className="font-display text-3xl text-dr-white mb-8 uppercase">CONTACT SUPPORT</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {contactMethods.map((method, idx) => (
                <ScaleIn key={method.title} delay={idx * 0.1}>
                  <div className="bg-dr-white border-4 border-dr-black p-6 hover:border-dr-yellow transition-all">
                    <div className={`${method.color} border-2 border-dr-black p-3 inline-block mb-4`}>
                      <method.icon className="h-6 w-6 text-dr-black" />
                    </div>
                    <h3 className="font-display text-xl text-dr-black uppercase mb-2">
                      {method.title}
                    </h3>
                    <p className="text-sm font-bold text-dr-black mb-3 opacity-70">
                      {method.description}
                    </p>
                    <p className="font-display text-lg text-dr-black">
                      {method.detail}
                    </p>
                  </div>
                </ScaleIn>
              ))}
            </div>
          </div>
        </section>
      </SlideUp>

      <section className="bg-dr-yellow border-b-4 border-dr-black py-12">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16">
          <h2 className="font-display text-3xl text-dr-black mb-8 uppercase">SUBMIT A TICKET</h2>
          <div className="max-w-2xl bg-dr-white border-4 border-dr-black p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  YOUR NAME
                </label>
                <input
                  type="text"
                  className="w-full border-4 border-dr-black p-4 font-semibold"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  className="w-full border-4 border-dr-black p-4 font-semibold"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  ISSUE CATEGORY
                </label>
                <select className="w-full border-4 border-dr-black p-4 font-semibold">
                  <option>Technical Issue</option>
                  <option>Account Access</option>
                  <option>Calendar & Scheduling</option>
                  <option>User Management</option>
                  <option>Billing & Payments</option>
                  <option>Feature Request</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  PRIORITY
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button className="bg-dr-green border-4 border-dr-black p-4 font-bold uppercase hover:bg-dr-black hover:text-dr-green transition-all">
                    LOW
                  </button>
                  <button className="bg-dr-yellow border-4 border-dr-black p-4 font-bold uppercase hover:bg-dr-black hover:text-dr-yellow transition-all">
                    MEDIUM
                  </button>
                  <button className="bg-dr-peach border-4 border-dr-black p-4 font-bold uppercase hover:bg-dr-black hover:text-dr-peach transition-all">
                    HIGH
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  DESCRIBE YOUR ISSUE
                </label>
                <textarea
                  rows={6}
                  className="w-full border-4 border-dr-black p-4 font-semibold resize-none"
                  placeholder="Please provide as much detail as possible..."
                ></textarea>
              </div>

              <Button variant="black" size="lg" className="w-full">
                <MessageSquare className="mr-2 h-5 w-5" />
                SUBMIT TICKET
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dr-purple border-b-4 border-dr-black py-12">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16">
          <h2 className="font-display text-3xl text-dr-white mb-8 uppercase">HELP RESOURCES</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource, idx) => (
              <ScaleIn key={resource.title} delay={idx * 0.1}>
                <div className="bg-dr-white border-4 border-dr-black p-6 hover:border-dr-yellow transition-all cursor-pointer">
                  <div className={`${resource.color} border-2 border-dr-black p-3 inline-block mb-4`}>
                    <resource.icon className="h-6 w-6 text-dr-black" />
                  </div>
                  <h3 className="font-display text-xl text-dr-black uppercase mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-sm font-bold text-dr-black opacity-70">
                    {resource.description}
                  </p>
                </div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-dr-black border-t-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-display text-sm text-dr-white uppercase">
              © 2024 DIGITAL RENAISSANCE INSTITUTE
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-dr-yellow hover:text-dr-white font-bold uppercase text-sm transition-colors">
                PRIVACY
              </Link>
              <Link href="/terms" className="text-dr-yellow hover:text-dr-white font-bold uppercase text-sm transition-colors">
                TERMS
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
