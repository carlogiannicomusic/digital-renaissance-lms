// Email service - Currently logs to console
// To enable real emails: Install Resend and add RESEND_API_KEY to .env

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // For now, log to console
  // In production, replace with Resend or your email service

  console.log('\n📧 ===== EMAIL NOTIFICATION =====')
  console.log(`TO: ${to}`)
  console.log(`SUBJECT: ${subject}`)
  console.log(`BODY:\n${html}`)
  console.log('================================\n')

  // TODO: Uncomment when Resend is configured
  /*
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Digital Renaissance <noreply@yourdomain.com>',
    to,
    subject,
    html,
  })
  */

  return { success: true }
}

export function generateInvitationEmail(
  email: string,
  token: string,
  inviterName: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
  const inviteUrl = `${baseUrl}/register?token=${token}`

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #000000;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          border: 4px solid #000000;
          padding: 32px;
          background-color: #F2EC62;
        }
        .header {
          text-transform: uppercase;
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 20px;
          color: #000000;
        }
        .button {
          display: inline-block;
          padding: 16px 32px;
          background-color: #000000;
          color: #FFFFFF;
          text-decoration: none;
          font-weight: bold;
          text-transform: uppercase;
          border: 4px solid #000000;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #000000;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Welcome to Digital Renaissance</div>

        <p><strong>Hi there!</strong></p>

        <p>${inviterName} has invited you to join <strong>Digital Renaissance Music Institute</strong> as a student.</p>

        <p>Click the button below to complete your registration:</p>

        <a href="${inviteUrl}" class="button">COMPLETE REGISTRATION</a>

        <p>Or copy and paste this link into your browser:<br>
        <a href="${inviteUrl}">${inviteUrl}</a></p>

        <p><strong>This invitation link will expire in 7 days.</strong></p>

        <div class="footer">
          <p>© 2024 Digital Renaissance Institute</p>
          <p>If you didn't expect this invitation, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateCredentialsEmail(
  name: string,
  email: string,
  password: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
  const loginUrl = `${baseUrl}/login`

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #000000;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          border: 4px solid #000000;
          padding: 32px;
          background-color: #22b573;
        }
        .header {
          text-transform: uppercase;
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 20px;
          color: #000000;
        }
        .credentials {
          background-color: #FFFFFF;
          border: 4px solid #000000;
          padding: 20px;
          margin: 20px 0;
        }
        .credential-row {
          margin: 10px 0;
        }
        .label {
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
        }
        .value {
          font-size: 16px;
          font-weight: bold;
          color: #000000;
        }
        .button {
          display: inline-block;
          padding: 16px 32px;
          background-color: #000000;
          color: #FFFFFF;
          text-decoration: none;
          font-weight: bold;
          text-transform: uppercase;
          border: 4px solid #000000;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #000000;
        }
        .warning {
          background-color: #F2EC62;
          border: 2px solid #000000;
          padding: 15px;
          margin: 20px 0;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Your Account is Approved!</div>

        <p><strong>Welcome ${name}!</strong></p>

        <p>Your registration has been approved. You can now access the Digital Renaissance Learning Management System.</p>

        <div class="credentials">
          <div class="credential-row">
            <div class="label">Email</div>
            <div class="value">${email}</div>
          </div>
          <div class="credential-row">
            <div class="label">Password</div>
            <div class="value">${password}</div>
          </div>
        </div>

        <a href="${loginUrl}" class="button">LOGIN NOW</a>

        <div class="warning">
          ⚠️ IMPORTANT: Please change your password after your first login for security.
        </div>

        <div class="footer">
          <p>© 2024 Digital Renaissance Institute</p>
          <p>If you have any questions, please contact your administrator.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
