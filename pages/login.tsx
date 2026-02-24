import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already logged in
    const sessionStr = localStorage.getItem('bscpro_session')
    if (sessionStr) {
      const session = JSON.parse(sessionStr)
      if (session?.access_token) {
        router.push('/dashboard')
      }
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('[Login] Attempting login for:', email)

    try {
      console.log('[Login] Sending request to /api/auth/login')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      console.log('[Login] Response status:', response.status)
      const data = await response.json()
      console.log('[Login] Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      console.log('[Login] Storing session and user data')
      // Store session
      localStorage.setItem('bscpro_session', JSON.stringify(data.session))
      localStorage.setItem('bscpro_user', JSON.stringify(data.user))

      console.log('[Login] Redirecting to dashboard')
      // Redirect to dashboard
      router.push('/dashboard')

    } catch (err: any) {
      console.error('[Login] Error:', err)
      setError(err.message || 'Ongeldige email of wachtwoord')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login | BSC Pro - Bank Statement Converter</title>
        <meta name="description" content="Log in op BSC Pro om je bankafschriften te converteren naar Excel/CSV. Veilig en snel." />
        <meta name="keywords" content="BSC Pro login, bank statement converter inloggen" />
        <link rel="canonical" href="https://www.bscpro.nl/login/" />
        <meta name="robots" content="noindex, follow" />
      </Head>
      
      <div className="min-h-screen">
        <Navbar />

        <div style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            background: 'rgba(10, 18, 32, 0.8)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '420px',
            width: '100%',
            margin: '0 16px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', marginBottom: '8px', fontFamily: 'var(--font-syne), Syne, sans-serif' }}>
                Welkom terug
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Log in om je documenten te converteren
              </p>
            </div>

            {error && (
              <div style={{ 
                marginBottom: '20px', 
                padding: '12px 16px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.3)', 
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#ffffff', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(10, 18, 32, 0.6)',
                    border: '1px solid rgba(0, 212, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  placeholder="jouw@email.nl"
                  onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0, 212, 255, 0.15)'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#ffffff', marginBottom: '8px' }}>
                  Wachtwoord
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(10, 18, 32, 0.6)',
                    border: '1px solid rgba(0, 212, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  placeholder="••••••••"
                  onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0, 212, 255, 0.15)'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#334155' : '#00d4ff',
                  color: loading ? '#94a3b8' : '#080d14',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.2s',
                  marginTop: '8px'
                }}
              >
                {loading ? 'Inloggen...' : 'Inloggen'}
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Nog geen account?{' '}
                <Link href="/register" style={{ color: '#00d4ff', textDecoration: 'none' }}>
                  Registreer hier
                </Link>
              </p>
            </div>
          </div>
        </div>

        <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(0, 212, 255, 0.1)' }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            © 2026 BSC Pro. Alle rechten voorbehouden.
          </p>
        </footer>
      </div>
    </>
  )
}
