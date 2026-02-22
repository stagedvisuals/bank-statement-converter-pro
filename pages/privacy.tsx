import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, Trash2 } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-fintech-bg">
      <Head>
        <title>Privacy Policy | BSC Pro - Bank Statement Converter</title>
        <meta name="description" content="Privacybeleid van Bank Statement Converter Pro. Wij nemen uw privacy uiterst serieus. AVG/GDPR compliant." />
        <meta name="keywords" content="BSC Pro privacy, bankgegevens veiligheid, AVG compliant" />
        <link rel="canonical" href="https://www.bscpro.nl/privacy/" />
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
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-navy">Privacy Policy</h1>
              <p className="text-slate">Privacybeleid</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate mb-8">Laatst bijgewerkt: 22 februari 2026</p>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-navy mb-4">1. Inleiding</h2>
              <p className="text-slate leading-relaxed">
                Welkom bij BSC Pro. Wij nemen uw privacy uiterst serieus. Dit beleid legt uit hoe wij omgaan met uw gegevens.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-navy mb-4">2. Gegevensverwerking</h2>
              <div className="bg-fintech-bg rounded-xl p-6 mb-4">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-navy">Financiële Documenten</h3>
                    <p className="text-slate text-sm">
                      De PDF-bestanden die u uploadt, worden uitsluitend verwerkt voor conversie. 
                      Wij bewaren deze bestanden nooit langer dan 24 uur.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-navy">Accountinformatie</h3>
                    <p className="text-slate text-sm">
                      Wij bewaren uw e-mailadres en betalingsgeschiedenis voor accountbeheer.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-navy mb-4">3. Beveiliging</h2>
              <div className="flex items-center gap-4 p-4 bg-success/5 border border-success/10 rounded-xl mb-4">
                <Lock className="w-8 h-8 text-success" />
                <p className="text-slate">
                  Alle gegevens worden versleuteld (SSL/TLS) verzonden naar onze beveiligde servers 
                  binnen de Europese Unie. Wij hebben geen toegang tot uw bankinloggegevens.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-navy mb-4">4. Uw Rechten</h2>
              <p className="text-slate leading-relaxed mb-4">
                U heeft het recht op inzage, correctie en verwijdering van uw persoonsgegevens. 
                Neem hiervoor contact op met{' '}
                <a href="mailto:support@bscpro.ai" className="text-success hover:underline">
                  support@bscpro.ai
                </a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-navy mb-4">5. Cookies</h2>
              <p className="text-slate leading-relaxed">
                Wij gebruiken alleen functionele cookies die noodzakelijk zijn voor het werken van de website. 
                Geen tracking cookies of third-party analytics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy mb-4">6. Contact</h2>
              <p className="text-slate leading-relaxed">
                Vragen over dit privacybeleid? Neem contact op via{' '}
                <a href="mailto:support@bscpro.ai" className="text-success hover:underline">
                  support@bscpro.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate text-sm border-t border-fintech-border">
        <p>© 2026 BSC Pro. Alle rechten voorbehouden.</p>
      </footer>
    </div>
  )
}

// Icons
function FileText({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function User({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}
