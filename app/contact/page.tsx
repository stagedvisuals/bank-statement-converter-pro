'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    onderwerp: '',
    bericht: '',
    privacy: false
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setStatus('success')
        setFormData({ 
          naam: '', 
          email: '', 
          onderwerp: '', 
          bericht: '', 
          privacy: false 
        })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-4">Neem contact op</h1>
          <p className="text-lg text-muted-foreground mb-8">
            We reageren binnen 2 werkdagen
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-xl p-6">
              {status === 'success' ? (
                <div className="text-center py-8">
                  <p className="text-2xl mb-2">✅</p>
                  <p className="text-lg font-semibold mb-2">Bericht verzonden!</p>
                  <p className="text-muted-foreground">
                    We reageren binnen 2 werkdagen.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 text-[#00b8d9] hover:underline text-sm"
                  >
                    Nieuw bericht sturen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="naam" className="block text-sm font-medium text-foreground mb-1">
                      Naam *
                    </label>
                    <input
                      type="text"
                      id="naam"
                      value={formData.naam}
                      onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div>
                    <label htmlFor="onderwerp" className="block text-sm font-medium text-foreground mb-1">
                      Onderwerp *
                    </label>
                    <input
                      type="text"
                      id="onderwerp"
                      value={formData.onderwerp}
                      onChange={(e) => setFormData({ ...formData, onderwerp: e.target.value })}
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div>
                    <label htmlFor="bericht" className="block text-sm font-medium text-foreground mb-1">
                      Bericht *
                    </label>
                    <textarea
                      id="bericht"
                      value={formData.bericht}
                      onChange={(e) => setFormData({ ...formData, bericht: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="privacy"
                      checked={formData.privacy}
                      onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
                      className="mt-1 mr-2"
                      required
                      disabled={status === 'loading'}
                    />
                    <label htmlFor="privacy" className="text-sm text-foreground">
                      Ik ga akkoord met het{' '}
                      <Link href="/privacy" className="text-[#00b8d9] hover:underline">
                        privacybeleid
                      </Link>
                      . *
                    </label>
                  </div>

                  {status === 'error' && (
                    <div className="text-red-500 text-sm">
                      Er is iets misgegaan. Probeer het opnieuw.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 bg-[#00b8d9] text-[#080d14] font-semibold rounded-lg hover:bg-[#00a8c9] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Verzenden...' : 'Verstuur bericht'}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Contactgegevens</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">info@bscpro.nl</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">KVK</p>
                    <p className="font-medium">12345678</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">BTW</p>
                    <p className="font-medium">NL123456789B01</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Veelgestelde vragen</h3>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Bekijk onze{' '}
                    <Link href="/faq" className="text-[#00b8d9] hover:underline">
                      FAQ pagina
                    </Link>{' '}
                    voor veelgestelde vragen over BSCPro.
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Support</h3>
                <p className="text-sm text-muted-foreground">
                  Voor technische support, log in op je account en gebruik het support formulier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
