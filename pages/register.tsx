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
        <div className="min-h-screen bg-background relative">
          <Navbar />
          <div className="pt-28 min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
            <div className="bg-card border border-border rounded-2xl p-10 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                <span className="text-2xl">✅</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>
                Registratie succesvol!
              </h1>
              <p className="text-muted-foreground mb-6">
                Je account is aangemaakt. Je kunt nu inloggen.
              </p>
              <Link 
                href="/login"
                className="block w-full py-3.5 bg-[#00b8d9] text-[#080d14] font-semibold rounded-md text-center hover:shadow-[0_0_20px_rgba(0,184,217,0.4)]"
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
        <meta name="robots" content="noindex, follow" />
      </Head>
      
      <div className="min-h-screen bg-background relative">
        <Navbar />

        <div className="pt-28 pb-16 min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-10 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Start gratis
              </h1>
              <p className="text-muted-foreground text-sm">
                Maak je account aan en krijg 2 gratis conversies
              </p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Naam
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground text-sm outline-none transition-all focus:border-[#00b8d9] focus:ring-1 focus:ring-[#00b8d9]"
                  placeholder="Jouw naam"
                />
              </div>

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
                  minLength={6}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground text-sm outline-none transition-all focus:border-[#00b8d9] focus:ring-1 focus:ring-[#00b8d9]"
                  placeholder="Minimaal 6 tekens"
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
                {loading ? 'Account aanmaken...' : 'Gratis account aanmaken'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Al een account?{' '}
                <Link href="/login" className="text-[#00b8d9] hover:underline">
                  Log in
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
