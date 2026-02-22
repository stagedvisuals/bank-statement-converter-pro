import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

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
        <div className="min-h-screen flex flex-col bg-fintech-bg">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 card-shadow border border-fintech-border max-w-md w-full text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h1 className="text-2xl font-bold text-navy mb-2">Registratie succesvol!</h1>
              <p className="text-slate mb-6">
                Je account is aangemaakt. Je kunt nu inloggen.
              </p>
              <Link 
                href="/login"
                className="inline-block w-full py-4 bg-success text-white font-bold rounded-xl hover:bg-success-dark transition-all"
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
      <div className="min-h-screen flex flex-col bg-fintech-bg">
        <nav className="w-full py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold gradient-text">BSC Pro</Link>
            <Link href="/login" className="text-slate hover:text-navy transition-colors font-medium">
              Al een account?
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 card-shadow border border-fintech-border max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-navy mb-2">Start gratis</h1>
              <p className="text-slate">Maak je account aan en krijg 2 gratis conversies</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Naam</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-fintech-bg border border-fintech-border rounded-xl focus:outline-none focus:border-success"
                  placeholder="Jouw naam"
                />
              </div>

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
                  minLength={6}
                  className="w-full px-4 py-3 bg-fintech-bg border border-fintech-border rounded-xl focus:outline-none focus:border-success"
                  placeholder="Minimaal 6 tekens"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-success text-white font-bold rounded-xl hover:bg-success-dark transition-all disabled:opacity-50"
              >
                {loading ? 'Bezig...' : 'Account aanmaken'}
              </button>
            </form>

            <p className="text-center text-xs text-slate mt-6">
              Door te registreren ga je akkoord met onze{' '}
              <Link href="/terms" className="text-success hover:underline">Terms of Service</Link>
              {' '}en{' '}
              <Link href="/privacy" className="text-success hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>

        <footer className="py-6 text-center text-slate text-sm">
          <p>© 2026 BSC Pro. Alle rechten voorbehouden.</p>
        </footer>
      </div>
    </>
  )
}
