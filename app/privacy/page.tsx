'use client'

import Link from 'next/link'
import { SlideUp } from '@/components/page-transition'
import { Shield } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-dr-white">
      <header className="bg-dr-black border-b-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-dr-yellow border-2 border-dr-yellow p-3">
              <Shield className="h-6 w-6 text-dr-black" />
            </div>
            <div>
              <Link href="/dashboard" className="text-dr-yellow hover:text-dr-white text-sm font-bold uppercase mb-1 block transition-colors">
                ← BACK TO DASHBOARD
              </Link>
              <h1 className="font-display text-2xl md:text-3xl text-dr-yellow uppercase tracking-tight">
                PRIVACY POLICY
              </h1>
            </div>
          </div>
        </div>
      </header>

      <SlideUp>
        <section className="max-w-4xl mx-auto px-8 py-12">
          <div className="bg-dr-yellow border-4 border-dr-black p-8 mb-8">
            <p className="font-bold text-dr-black mb-4">
              LAST UPDATED: JANUARY 2024
            </p>
            <p className="text-dr-black leading-relaxed">
              Digital Renaissance Music Institute ("we", "our", or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
              use our Learning Management System.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                1. INFORMATION WE COLLECT
              </h2>
              <div className="space-y-4 text-dr-black">
                <div>
                  <h3 className="font-bold uppercase mb-2">PERSONAL INFORMATION</h3>
                  <p className="leading-relaxed">
                    We collect information that you provide directly to us, including: name, email address,
                    phone number, instrument preferences, and payment information.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold uppercase mb-2">USAGE INFORMATION</h3>
                  <p className="leading-relaxed">
                    We automatically collect certain information about your device and how you interact with our LMS,
                    including IP address, browser type, pages visited, and time spent on pages.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                2. HOW WE USE YOUR INFORMATION
              </h2>
              <ul className="space-y-2 text-dr-black list-disc list-inside">
                <li>To provide and maintain our LMS services</li>
                <li>To process your enrollment and manage your classes</li>
                <li>To communicate with you about schedules, updates, and announcements</li>
                <li>To improve our services and develop new features</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                3. INFORMATION SHARING
              </h2>
              <p className="text-dr-black leading-relaxed mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="space-y-2 text-dr-black list-disc list-inside">
                <li>With your teachers and administrators for educational purposes</li>
                <li>With service providers who assist in operating our LMS</li>
                <li>When required by law or to protect our rights</li>
                <li>With your consent or at your direction</li>
              </ul>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                4. DATA SECURITY
              </h2>
              <p className="text-dr-black leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission
                is ever completely secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                5. YOUR RIGHTS
              </h2>
              <ul className="space-y-2 text-dr-black list-disc list-inside">
                <li>Access, update, or delete your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>Request restriction of processing your personal information</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                6. CHILDREN'S PRIVACY
              </h2>
              <p className="text-dr-black leading-relaxed">
                Our LMS may be used by minors under the age of 18. We comply with applicable laws regarding the
                collection and use of information from children. Parents and guardians have the right to review,
                delete, or refuse further collection of their child's information.
              </p>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                7. CONTACT US
              </h2>
              <p className="text-dr-black leading-relaxed mb-4">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-dr-black font-bold">
                <p>EMAIL: privacy@digitalrenaissance.edu</p>
                <p>PHONE: (555) 123-4567</p>
                <p>ADDRESS: Digital Renaissance Music Institute</p>
              </div>
            </div>
          </div>
        </section>
      </SlideUp>

      <footer className="bg-dr-black border-t-4 border-dr-yellow mt-12">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-display text-sm text-dr-white uppercase">
              © 2024 DIGITAL RENAISSANCE INSTITUTE
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-dr-yellow hover:text-dr-white font-bold uppercase text-sm transition-colors">
                TERMS OF SERVICE
              </Link>
              <Link href="/support" className="text-dr-yellow hover:text-dr-white font-bold uppercase text-sm transition-colors">
                SUPPORT
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
