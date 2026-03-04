'use client'

import { useState } from 'react'
import { Building2, CheckCircle, Mail } from 'lucide-react'

export default function EnterpriseWaitlist() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/enterprise-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Er is iets misgegaan')
      }

      setSubmitted(true)
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl p-8 relative overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, rgba(10, 18, 32, 0.9) 0%, rgba(8, 13, 20, 0.95) 100%)',
      border: '1px solid rgba(0, 184, 217, 0.2)',
      boxShadow: '0 20px 40px rgba(0, 184, 217, 0.1)'
    }}>
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b8d9] opacity-5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(0, 184, 217, 0.1)',
            border: '1px solid rgba(0, 184, 217, 0.2)'
          }}>
            <Building2 className="w-7 h-7" style={{ color: '#00b8d9' }} />
          </div>
          <div>
            <h3 className="text-2xl font-bold" style={{ color: '#e8edf5' }}>Enterprise Plan</h3>
            <p className="text-sm" style={{ color: '#6b7fa3' }}>Voor accountantskantoren & grote organisaties</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ 
              background: 'rgba(0, 184, 217, 0.1)',
              border: '1px solid rgba(0, 184, 217, 0.3)'
            }}>
              <CheckCircle className="w-8 h-8" style={{ color: '#00b8d9' }} />
            </div>
            <h4 className="text-xl font-bold mb-2" style={{ color: '#e8edf5' }}>Bedankt voor je interesse!</h4>
            <p className="text-sm" style={{ color: '#6b7fa3' }}>
              We nemen contact met je op zodra het Enterprise plan beschikbaar is.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 px-6 py-3 rounded-xl font-medium transition-all hover:opacity-90"
              style={{ 
                background: 'rgba(0, 184, 217, 0.1)',
                border: '1px solid rgba(0, 184, 217, 0.3)',
                color: '#00b8d9'
              }}
            >
              Nog een email toevoegen
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <ul className="space-y-3">
                {[
                  'Onbeperkt aantal gebruikers',
                  'Whitelabel rapporten',
                  'API toegang & integraties',
                  'Prioritaire support',
                  'Aangepaste workflows',
                  'SLA garantie'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ 
                      background: 'rgba(0, 184, 217, 0.1)'
                    }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: '#00b8d9' }}></div>
                    </div>
                    <span style={{ color: '#e8edf5' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#e8edf5' }}>
                  Emailadres
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6b7fa3' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jouw@bedrijf.nl"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#e8edf5'
                    }}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg text-sm" style={{ 
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#ef4444'
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  background: 'linear-gradient(135deg, #00b8d9 0%, #0099cc 100%)',
                  color: '#080d14'
                }}
              >
                {loading ? 'Versturen...' : 'Meld je aan voor de waitlist'}
              </button>

              <p className="text-xs text-center" style={{ color: '#6b7fa3' }}>
                We sturen je een update zodra Enterprise beschikbaar is. Geen spam.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
