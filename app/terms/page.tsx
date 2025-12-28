'use client'

import Link from 'next/link'
import { SlideUp } from '@/components/page-transition'
import { FileText } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-dr-white">
      <header className="bg-dr-black border-b-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-dr-blue border-2 border-dr-blue p-3">
              <FileText className="h-6 w-6 text-dr-black" />
            </div>
            <div>
              <Link href="/dashboard" className="text-dr-yellow hover:text-dr-white text-sm font-bold uppercase mb-1 block transition-colors">
                ← BACK TO DASHBOARD
              </Link>
              <h1 className="font-display text-2xl md:text-3xl text-dr-yellow uppercase tracking-tight">
                TERMS OF SERVICE
              </h1>
            </div>
          </div>
        </div>
      </header>

      <SlideUp>
        <section className="max-w-4xl mx-auto px-8 py-12">
          <div className="bg-dr-blue border-4 border-dr-black p-8 mb-8">
            <p className="font-bold text-dr-black mb-4">
              LAST UPDATED: JANUARY 2024
            </p>
            <p className="text-dr-black leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of the Digital Renaissance Learning
              Management System ("LMS", "Service"). By accessing or using the Service, you agree to be bound by
              these Terms.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                1. ACCEPTANCE OF TERMS
              </h2>
              <p className="text-dr-black leading-relaxed">
                By registering for, accessing, or using the LMS, you acknowledge that you have read, understood,
                and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms,
                you may not access or use the Service.
              </p>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                2. USER ACCOUNTS
              </h2>
              <div className="space-y-4 text-dr-black">
                <p className="leading-relaxed">
                  To access certain features of the LMS, you must register for an account. You agree to:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                </ul>
              </div>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                3. USER CONDUCT
              </h2>
              <p className="text-dr-black leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="space-y-2 text-dr-black list-disc list-inside">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Violate the intellectual property rights of others</li>
                <li>Upload or transmit viruses, malware, or other malicious code</li>
                <li>Attempt to gain unauthorized access to the Service or related systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Use automated systems to access the Service without permission</li>
              </ul>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                4. INTELLECTUAL PROPERTY
              </h2>
              <p className="text-dr-black leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by Digital Renaissance
                Music Institute and are protected by international copyright, trademark, patent, trade secret, and
                other intellectual property laws.
              </p>
              <p className="text-dr-black leading-relaxed">
                You retain ownership of any content you submit to the Service. By submitting content, you grant us
                a worldwide, non-exclusive, royalty-free license to use, copy, modify, and display such content
                solely for the purpose of providing the Service.
              </p>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                5. ENROLLMENT AND PAYMENT
              </h2>
              <div className="space-y-4 text-dr-black">
                <p className="leading-relaxed">
                  Enrollment in classes through the LMS constitutes a binding commitment. You agree to:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Pay all applicable fees for enrolled classes</li>
                  <li>Adhere to our cancellation and refund policies</li>
                  <li>Attend scheduled classes or notify instructors of absences</li>
                  <li>Follow the Institute's code of conduct during classes</li>
                </ul>
              </div>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                6. CANCELLATION AND REFUNDS
              </h2>
              <ul className="space-y-2 text-dr-black list-disc list-inside">
                <li>Class cancellations must be made at least 24 hours in advance</li>
                <li>Refunds are processed according to our published refund policy</li>
                <li>We reserve the right to cancel classes due to insufficient enrollment</li>
                <li>Makeup classes may be offered for Institute-initiated cancellations</li>
              </ul>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                7. LIMITATION OF LIABILITY
              </h2>
              <p className="text-dr-black leading-relaxed">
                To the maximum extent permitted by law, Digital Renaissance Music Institute shall not be liable
                for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits
                or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other
                intangible losses resulting from your use of the Service.
              </p>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                8. TERMINATION
              </h2>
              <p className="text-dr-black leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, without prior
                notice or liability, for any reason, including breach of these Terms. Upon termination, your
                right to use the Service will immediately cease.
              </p>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                9. CHANGES TO TERMS
              </h2>
              <p className="text-dr-black leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any material
                changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued
                use of the Service after changes constitutes acceptance of the modified Terms.
              </p>
            </div>

            <div className="bg-dr-white border-4 border-dr-black p-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-4">
                10. CONTACT INFORMATION
              </h2>
              <p className="text-dr-black leading-relaxed mb-4">
                For questions about these Terms, please contact us:
              </p>
              <div className="space-y-2 text-dr-black font-bold">
                <p>EMAIL: legal@digitalrenaissance.edu</p>
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
              <Link href="/privacy" className="text-dr-yellow hover:text-dr-white font-bold uppercase text-sm transition-colors">
                PRIVACY POLICY
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
