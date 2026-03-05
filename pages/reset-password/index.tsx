import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'
import { Eye, EyeOff } from 'lucide-react'
import Navbar from '@/components/Navbar'

// Create client only on client-side
let supabase: ReturnType<typeof createClient>
const getSupabase = () => {
  if (!supabase && typeof window !== 'undefined') {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return supabase
}

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if we have a session (user clicked reset link)
    const checkSession = async () => {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) {
        setError('Ongeldige of verlopen reset link. Vraag een nieuwe aan.')
      }
    }
    checkSession()
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens zijn')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await getSupabase().auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Nieuw wachtwoord | BSC Pro</title>
      </Head>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="pt-28 pb-16 min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-10 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Nieuw wachtwoord
              </h1>
              <p className="text-muted-foreground text-sm">
                Kies een nieuw wachtwoord voor je account
              </p>
            </div>

            {success ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 text-sm text-center">
                ✅ Wachtwoord gewijzigd! Je wordt doorgestuurd...
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-5">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nieuw wachtwoord
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimaal 8 tekens"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground text-sm outline-none transition-all focus:border-[#00b8d9] focus:ring-1 focus:ring-[#00b8d9] pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 font-semibold rounded-lg text-base transition-all ${
                    loading 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-[#00b8d9] text-[#080d14] hover:shadow-[0_0_20px_rgba(0,184,217,0.4)]'
                  }`}
                >
                  {loading ? 'Bezig...' : 'Wachtwoord wijzigen'}
                </button>
              </form>
            )}
          </div>
        </div>

        <footer className="py-6 text-center border-t border-border bg-background">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} BSC Pro. Alle rechten voorbehouden.
          </p>
        </footer>
      </div>
    </>
  )
}
