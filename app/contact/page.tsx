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
                      required
                      value={formData.naam}
                      onChange={e => setFormData(prev => ({ ...prev, naam: e.target.value }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
                      placeholder="Jouw naam"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
                      placeholder="jouw@email.nl"
                    />
                  </div>

                  <div>
                    <label htmlFor="onderwerp" className="block text-sm font-medium text-foreground mb-1">
                      Onderwerp *
                    </label>
                    <select
                      id="onderwerp"
                      required
                      value={formData.onderwerp}
                      onChange={e => setFormData(prev => ({ ...prev, onderwerp: e.target.value }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
                    >
                      <option value="">Kies een onderwerp</option>
                      <option value="algemeen">Algemene vraag</option>
                      <option value="technisch">Technisch probleem</option>
                      <option value="factuur">Factuur of betaling</option>
                      <option value="partnership">Partnership / samenwerking</option>
                      <option value="enterprise">Enterprise aanvraag</option>
                      <option value="anders">Anders</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bericht" className="block text-sm font-medium text-foreground mb-1">
                      Bericht *
                    </label>
                    <textarea
                      id="bericht"
                      required
                      rows={5}
                      value={formData.bericht}
                      onChange={e => setFormData(prev => ({ ...prev, bericht: e.target.value }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
                      placeholder="Vertel ons waarmee we je kunnen helpen..."
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      required
                      checked={formData.privacy}
                      onChange={e => setFormData(prev => ({ ...prev, privacy: e.target.checked }))}
                      className="mt-1 w-4 h-4 rounded border-border text-[#00b8d9] focus:ring-[#00b8d9]"
                    />
                    <label htmlFor="privacy" className="text-sm text-muted-foreground">
                      Ik ga akkoord met de{' '}
                      <Link href="/privacy" className="text-[#00b8d9] hover:underline">
                        privacyverklaring
                      </Link>{' '}
                      *
                    </label>
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-red-500">
                      Er is iets misgegaan. Probeer het opnieuw.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full px-6 py-3 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Verzenden...' : 'Verstuur bericht'}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Direct contact</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:info@bscpro.nl" className="text-[#00b8d9] hover:underline">
                        info@bscpro.nl
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🕐</span>
                    <div>
                      <p className="font-medium">Reactietijd</p>
                      <p className="text-muted-foreground">Binnen 2 werkdagen</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="font-medium">Locatie</p>
                      <p className="text-muted-foreground">Nederland</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
