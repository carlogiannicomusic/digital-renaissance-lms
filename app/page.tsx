export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      color: '#F2EC62',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#F2EC62',
        border: '4px solid #F2EC62',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        <span style={{
          fontSize: '32px',
          fontWeight: '900',
          color: '#000',
          letterSpacing: '2px'
        }}>DR</span>
      </div>

      <h1 style={{
        fontSize: '3rem',
        fontWeight: '900',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        Digital Renaissance LMS
      </h1>

      <p style={{
        fontSize: '1.5rem',
        marginBottom: '3rem',
        maxWidth: '600px'
      }}>
        Music Institute Learning Management System
      </p>

      <div style={{
        display: 'grid',
        gap: '1rem',
        maxWidth: '400px',
        width: '100%'
      }}>
        <a href="/dashboard/admin" style={{
          padding: '1.5rem',
          backgroundColor: '#4db8d3',
          color: '#000',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          border: '4px solid #000',
          textTransform: 'uppercase'
        }}>
          Administrator
        </a>

        <a href="/dashboard/teacher" style={{
          padding: '1.5rem',
          backgroundColor: '#d384d2',
          color: '#000',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          border: '4px solid #000',
          textTransform: 'uppercase'
        }}>
          Teacher
        </a>

        <a href="/dashboard/student" style={{
          padding: '1.5rem',
          backgroundColor: '#f39a76',
          color: '#000',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          border: '4px solid #000',
          textTransform: 'uppercase'
        }}>
          Student
        </a>
      </div>

      <p style={{
        marginTop: '3rem',
        fontSize: '0.9rem',
        opacity: 0.7
      }}>
        Build: 2025-01-07-v2
      </p>
    </div>
  )
}
