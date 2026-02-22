import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already logged in
    const session = localStorage.getItem('bscpro_session')
    if (session) {
      router.push('/dashboard')
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
      <div className="min-h-screen flex flex-col bg-fintech-bg">
        <nav className="w-full py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold gradient-text">BSC Pro</Link>
            <Link href="/register" className="text-slate hover:text-navy transition-colors font-medium">
              Nog geen account?
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 card-shadow border border-fintech-border max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-navy mb-2">Welkom terug</h1>
              <p className="text-slate">Log in om je documenten te converteren</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-fintech-bg border border-fintech-border rounded-xl focus:outline-none focus:border-success"
                  placeholder="jouw@email.nl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">Wachtwoord</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-fintech-bg border border-fintech-border rounded-xl focus:outline-none focus:border-success"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-success text-white font-bold rounded-xl hover:bg-success-dark transition-all disabled:opacity-50"
              >
                {loading ? 'Inloggen...' : 'Inloggen'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate">
                Test account: <span className="text-navy font-medium">arthybagdas@gmail.com</span>
              </p>
            </div>
          </div>
        </div>

        <footer className="py-6 text-center text-slate text-sm">
          <p>© 2026 BSC Pro. Alle rechten voorbehouden.</p>
        </footer>
      </div>
    </>
  )
}
