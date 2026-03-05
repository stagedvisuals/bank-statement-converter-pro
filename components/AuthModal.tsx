'use client'

import { useState } from 'react'
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...(isLogin ? {} : { name }) })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      // Authentication successful
      onSuccess()
      onClose()
      
      // Refresh page to update auth state
      window.location.reload()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#0a1220] border border-[#1e293b] rounded-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1e293b]">
          <div>
            <h2 className="text-2xl font-bold text-[#e8edf5]">
              {isLogin ? 'Welkom terug' : 'Start je gratis trial'}
            </h2>
            <p className="text-[#6b7fa3] mt-1">
              {isLogin ? 'Log in om verder te gaan' : '14 dagen gratis · Geen creditcard nodig'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1e293b] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#6b7fa3]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#e8edf5] mb-2">
                Naam
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b7fa3]" />
                <input
                  type="text"
                  name="name"
                  required={!isLogin}
                  className="w-full pl-10 pr-4 py-3 bg-[#080d14] border border-[#1e293b] rounded-lg text-[#e8edf5] placeholder-[#6b7fa3] focus:outline-none focus:border-[#00b8d9]"
                  placeholder="Jouw naam"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#e8edf5] mb-2">
              E-mailadres
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b7fa3]" />
              <input
                type="email"
                name="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#080d14] border border-[#1e293b] rounded-lg text-[#e8edf5] placeholder-[#6b7fa3] focus:outline-none focus:border-[#00b8d9]"
                placeholder="jouw@email.nl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e8edf5] mb-2">
              Wachtwoord
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b7fa3]" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-[#080d14] border border-[#1e293b] rounded-lg text-[#e8edf5] placeholder-[#6b7fa3] focus:outline-none focus:border-[#00b8d9]"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#00b8d9] to-[#0066cc] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? 'Even geduld...' : isLogin ? 'Inloggen' : 'Account aanmaken'}</span>
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-[#1e293b] bg-[#080d14]">
          <p className="text-center text-[#6b7fa3]">
            {isLogin ? 'Nog geen account?' : 'Al een account?'}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#00b8d9] hover:underline font-medium"
            >
              {isLogin ? 'Registreer gratis' : 'Log in'}
            </button>
          </p>
          <p className="text-xs text-center text-[#6b7fa3] mt-4">
            Door te registreren ga je akkoord met onze{' '}
            <a href="/voorwaarden" className="text-[#00b8d9] hover:underline">Algemene Voorwaarden</a>{' '}
            en{' '}
            <a href="/privacy" className="text-[#00b8d9] hover:underline">Privacyverklaring</a>
          </p>
        </div>
      </div>
    </div>
  )
}
