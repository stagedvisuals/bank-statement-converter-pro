import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registratie mislukt')
      }

      setSuccess(true)

    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <Head>
          <title>Registratie Succesvol | BSC Pro</title>
        </Head>
        <div className="min-h-screen">
          <Navbar />
          <div style={{ paddingTop: '120px', minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ 
              background: 'rgba(10, 18, 32, 0.8)', 
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 212, 255, 0.15)',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '420px',
              width: '100%',
              margin: '0 16px',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                background: 'rgba(0, 212, 255, 0.1)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 24px',
                border: '1px solid rgba(0, 212, 255, 0.3)'
              }}>
                <span style={{ fontSize: '28px' }}>✅</span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '12px', fontFamily: 'var(--font-syne), Syne, sans-serif' }}>
                Registratie succesvol!
              </h1>
              <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
                Je account is aangemaakt. Je kunt nu inloggen.
              </p>
              <Link 
                href="/login"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px',
                  background: '#00d4ff',
                  color: '#080d14',
                  fontWeight: 600,
                  borderRadius: '6px',
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                Ga naar login
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Registreren | BSC Pro - Bank Statement Converter</title>
        <meta name="description" content="Maak een gratis account aan bij BSC Pro. Converteer bankafschriften naar Excel/CSV met AI." />
        <meta name="keywords" content="BSC Pro registreren, gratis account bank converter" />
        <link rel="canonical" href="https://www.bscpro.nl/register/" />
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
                Start gratis
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Maak je account aan en krijg 2 gratis conversies
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

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#ffffff', marginBottom: '8px' }}>
                  Naam
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  placeholder="Jouw naam"
                  onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0, 212, 255, 0.15)'}
                />
              </div>

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
                  minLength={6}
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
                  placeholder="Minimaal 6 tekens"
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
                {loading ? 'Bezig...' : 'Account aanmaken'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '24px' }}>
              Door te registreren ga je akkoord met onze{' '}
              <Link href="/voorwaarden" style={{ color: '#00d4ff', textDecoration: 'none' }}>Algemene Voorwaarden</Link>
              {' '}en{' '}
              <Link href="/privacy" style={{ color: '#00d4ff', textDecoration: 'none' }}>Privacy Policy</Link>
            </p>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Al een account?{' '}
                <Link href="/login" style={{ color: '#00d4ff', textDecoration: 'none' }}>
                  Log hier in
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
