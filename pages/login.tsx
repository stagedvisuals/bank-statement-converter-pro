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

        <div className="pt-[120px] pb-[60px] min-h-[calc(100vh-200px)] flex items-center justify-center bg-slate-50 dark:bg-[#080d14] transition-colors duration-300">
          <div className="bg-white dark:bg-[rgba(10,18,32,0.8)] backdrop-blur-xl border border-slate-200 dark:border-cyan-500/15 rounded-2xl p-10 max-w-[420px] w-full mx-4 shadow-lg dark:shadow-none transition-colors duration-300">
            <div className="text-center mb-8">
              <h1 className="text-[28px] font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>
                Welkom terug
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Log in om je documenten te converteren
              </p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-[rgba(10,18,32,0.6)] border border-slate-300 dark:border-cyan-500/15 rounded-lg text-slate-900 dark:text-white text-sm outline-none transition-all focus:border-cyan-400"
                  placeholder="jouw@email.nl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
                  Wachtwoord
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-[rgba(10,18,32,0.6)] border border-slate-300 dark:border-cyan-500/15 rounded-lg text-slate-900 dark:text-white text-sm outline-none transition-all focus:border-cyan-400"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 font-semibold rounded-lg border-none text-base mt-2 transition-all ${
                  loading 
                    ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                    : 'bg-cyan-400 text-slate-900 hover:shadow-[0_0_20px_rgba(0,184,217,0.4)] cursor-pointer'
                }`}
              >
                {loading ? 'Inloggen...' : 'Inloggen'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nog geen account?{' '}
                <Link href="/register" className="text-cyan-500 hover:text-cyan-400 no-underline">
                  Registreer hier
                </Link>
              </p>
            </div>
          </div>
        </div>

        <footer className="py-6 text-center border-t border-slate-200 dark:border-cyan-500/10 bg-slate-50 dark:bg-[#080d14] transition-colors duration-300">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2026 BSC Pro. Alle rechten voorbehouden.
          </p>
        </footer>
      </div>
    </>
  )
}
