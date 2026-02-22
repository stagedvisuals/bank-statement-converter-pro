import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, Code, Mail } from 'lucide-react'

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-fintech-bg">
      <Head>
        <title>API Docs | BSC Pro</title>
        <meta name="description" content="BSC Pro API Documentation" />
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
        <div className="bg-white rounded-2xl p-8 md:p-12 card-shadow border border-fintech-border text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Code className="w-8 h-8 text-accent" />
          </div>
          
          <h1 className="text-3xl font-bold text-navy mb-4">API Documentation</h1>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-warning rounded-full animate-pulse"></span>
            <span className="text-warning-dark font-medium text-sm">Beta</span>
          </div>
          
          <p className="text-slate text-lg mb-8 max-w-xl mx-auto">
            Onze API is momenteel in beta. Neem contact op voor vroege toegang.
          </p>
          
          <div className="bg-fintech-bg rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-navy mb-3">Wat kun je verwachten?</h2>
            <ul className="space-y-2 text-slate text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                RESTful API met JSON responses
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                Batch processing voor meerdere documenten
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                Webhook support voor async verwerking
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                Uitgebreide documentatie en code voorbeelden
              </li>
            </ul>
          </div>
          
          <a 
            href="mailto:support@bscpro.ai?subject=API%20Beta%20Toegang%20Aanvraag"
            className="inline-flex items-center gap-2 px-8 py-4 bg-success text-white font-bold rounded-xl hover:bg-success-dark transition-all hover:shadow-glow"
          >
            <Mail className="w-5 h-5" />
            Vraag vroege toegang aan
          </a>
          
          <p className="text-slate text-sm mt-6">
            Alleen beschikbaar voor Enterprise klanten
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate text-sm border-t border-fintech-border">
        <p>© 2026 BSC Pro. Alle rechten voorbehouden.</p>
      </footer>
    </div>
  )
}
