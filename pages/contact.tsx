import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, Mail, Building, MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Er is iets misgegaan bij het verzenden')
      }

      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error: any) {
      setStatus('error')
      setErrorMessage(error.message || 'Er is een fout opgetreden. Probeer het later opnieuw.')
    }
  }

  return (
    <div className="min-h-screen bg-fintech-bg">
      <Head>
        <title>Contact | BSC Pro - Bank Statement Converter</title>
        <meta name="description" content="Neem contact op met Bank Statement Converter Pro. We staan voor je klaar! Support via email." />
        <meta name="keywords" content="BSC Pro contact, support bank converter, hulp nodig" />
        <link rel="canonical" href="https://www.bscpro.nl/contact/" />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* Header */}
      <nav className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-white border-b border-fintech-border">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate hover:text-navy transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Terug naar Home</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 md:p-12 card-shadow border border-fintech-border">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-navy mb-4">Contact</h1>
            <p className="text-slate">We staan voor je klaar om al je vragen te beantwoorden</p>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-navy mb-1">Bedrijf</h3>
                <p className="text-slate">BSC Pro</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-navy mb-1">E-mail</h3>
                <a href="mailto:info@bscpro.nl" className="text-slate hover:text-success transition-colors">
                  info@bscpro.nl
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border-t border-fintech-border pt-10">
            <h2 className="text-xl font-bold text-navy mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Stuur ons een bericht
            </h2>

            {status === 'success' ? (
              <div className="bg-success/10 border border-success/20 rounded-xl p-6 text-center">
                <p className="text-success-dark font-medium">Bedankt voor je bericht!</p>
                <p className="text-slate mt-2">We nemen zo snel mogelijk contact met je op.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-4 px-4 py-2 bg-success text-white rounded-lg hover:bg-success-dark transition-colors"
                >
                  Nieuw bericht
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
                    <p className="text-danger font-medium">{errorMessage}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-navy mb-2">
                    Naam
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-fintech-bg border border-fintech-border rounded-xl focus:outline-none focus:border-success"
                    placeholder="Jouw naam"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-fintech-bg border border-fintech-border rounded-xl focus:outline-none focus:border-success"
                    placeholder="jouw@email.nl"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-navy mb-2">
                    Bericht
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-fintech-bg border border-fintech-border rounded-xl focus:outline-none focus:border-success resize-none"
                    placeholder="Waarmee kunnen we je helpen?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-success text-white font-bold rounded-xl hover:bg-success-dark transition-all disabled:opacity-50"
                >
                  {status === 'loading' ? 'Verzenden...' : 'Verstuur bericht'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate text-sm border-t border-fintech-border">
        <p>© 2026 BSC Pro. Alle rechten voorbehouden.</p>
        <p className="mt-2">
          Contact: <a href="mailto:info@bscpro.nl" className="text-success hover:underline">info@bscpro.nl</a>
        </p>
      </footer>
    </div>
  )
}
