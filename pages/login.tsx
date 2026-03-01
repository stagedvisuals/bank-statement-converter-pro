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

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      localStorage.setItem('bscpro_session', JSON.stringify(data.session))
      localStorage.setItem('bscpro_user', JSON.stringify(data.user))
      // Kleine delay voor cookie propagation
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push('/dashboard')

    } catch (err: any) {
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
        <meta name="robots" content="noindex, follow" />
      </Head>
      
      <div className="min-h-screen bg-background relative">
        <Navbar />

        <div className="pt-28 pb-16 min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-10 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Welkom terug
              </h1>
              <p className="text-muted-foreground text-sm">
                Log in om je documenten te converteren
              </p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground text-sm outline-none transition-all focus:border-[#00b8d9] focus:ring-1 focus:ring-[#00b8d9]"
                  placeholder="jouw@email.nl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Wachtwoord
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground text-sm outline-none transition-all focus:border-[#00b8d9] focus:ring-1 focus:ring-[#00b8d9]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 font-semibold rounded-lg text-base mt-2 transition-all ${
                  loading 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                    : 'bg-[#00b8d9] text-[#080d14] hover:shadow-[0_0_20px_rgba(0,184,217,0.4)]'
                }`}
              >
                {loading ? 'Inloggen...' : 'Inloggen'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Nog geen account?{' '}
                <Link href="/register" className="text-[#00b8d9] hover:underline">
                  Registreer hier
                </Link>
              </p>
            </div>
          </div>
        </div>

        <footer className="py-6 text-center border-t border-border bg-background">
          <p className="text-sm text-muted-foreground">
            © 2026 BSC Pro. Alle rechten voorbehouden.
          </p>
        </footer>
      </div>
    </>
  )
}
