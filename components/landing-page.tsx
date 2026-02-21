'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

export default function LandingPage() {
  const { isSignedIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async (priceId: string) => {
    console.log('Checkout clicked:', priceId)
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      console.log('Checkout response:', data)
      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        setError(data.error)
        console.error('Checkout error:', data.error)
      }
    } catch (error: any) {
      console.error('Checkout fetch error:', error)
      setError(error.message || 'Payment failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold gradient-text">BSC Pro</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="hover:text-[var(--neon-blue)] transition-colors">Features</Link>
              <Link href="#pricing" className="hover:text-[var(--neon-blue)] transition-colors">Prijzen</Link>
              {isSignedIn ? (
                <Link href="/dashboard" className="px-6 py-2 rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-bold">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
                  <Link href="/register" className="px-6 py-2 rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-bold hover:shadow-lg hover:shadow-[var(--neon-blue)]/50 transition-all">
                    Start Gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--neon-blue)]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--neon-purple)]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 rounded-full glass mb-6">
            <span className="text-[var(--neon-blue)] font-medium">v2.0 Next.js Powered</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="gradient-text">Bank Statement</span><br />
            <span className="text-white">Converter Pro</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Zet PDF bankafschriften automatisch om naar Excel of CSV.<br />
            <span className="text-[var(--neon-blue)]">Snel, veilig, en accuraat.</span>
          </p>

          <p className="text-gray-500 mb-12">
            Door <span className="text-white font-semibold">Artur Bagdasarjan</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href={isSignedIn ? '/dashboard' : '/register'} className="inline-block px-8 py-4 text-lg bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-bold rounded-full hover:shadow-xl hover:shadow-[var(--neon-blue)]/50 transition-all transform hover:scale-105">
              {isSignedIn ? 'Naar Dashboard →' : 'Start Gratis Trial →'}
            </Link>
          </div>
          
          {error && (
            <div className="text-red-400 text-center mb-4 p-4 bg-red-500/20 rounded-lg">
              Error: {error}
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Kies je Plan</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Starter Pack</h3>
              <div className="text-5xl font-bold text-white mb-2">€5</div>
              <p className="text-gray-500 mb-6">eenmalig</p>
              <ul className="space-y-4 mb-8 text-left">
                <li className="text-gray-300">✓ 5 conversies</li>
                <li className="text-gray-300">✓ Alle bankformaten</li>
                <li className="text-gray-300">✓ Excel export</li>
              </ul>
              <button onClick={() => handleCheckout('starter')} disabled={loading} className="w-full py-4 rounded-full bg-gray-700 text-white font-bold hover:bg-gray-600 transition-all disabled:opacity-50">
                {loading ? 'Laden...' : 'Koop nu'}
              </button>
            </div>

            <div className="glass rounded-3xl p-8 border-2 border-[var(--neon-blue)]">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black text-sm font-bold">
                  POPULAIR
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Unlimited</h3>
              <div className="text-5xl font-bold text-white mb-2">€29<span className="text-lg text-gray-500">/maand</span></div>
              <ul className="space-y-4 mb-8 text-left">
                <li className="text-gray-300">✓ Onbeperkte conversies</li>
                <li className="text-gray-300">✓ Prioriteit verwerking</li>
                <li className="text-gray-300">✓ API toegang</li>
              </ul>
              <button onClick={() => handleCheckout('unlimited')} disabled={loading} className="w-full py-4 rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-bold hover:shadow-xl hover:shadow-[var(--neon-blue)]/50 transition-all disabled:opacity-50">
                {loading ? 'Laden...' : 'Start Unlimited →'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2025 Bank Statement Converter Pro - Door Artur Bagdasarjan</p>
        </div>
      </footer>
    </div>
  )
}
