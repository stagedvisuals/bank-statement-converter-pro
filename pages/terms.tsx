import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, FileText, CreditCard, AlertTriangle, Ban } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-fintech-bg">
      <Head>
        <title>Terms of Service | BSC Pro - Bank Statement Converter</title>
        <meta name="description" content="Algemene Voorwaarden van Bank Statement Converter Pro. Lees onze voorwaarden voor gebruik." />
        <link rel="canonical" href="https://www.bscpro.nl/terms/" />
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
            <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-navy" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-navy">Terms of Service</h1>
              <p className="text-slate">Algemene Voorwaarden</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate mb-8">Laatst bijgewerkt: 22 februari 2026</p>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-navy mb-4">1. Gebruik van de Dienst</h2>
              <p className="text-slate leading-relaxed">
                Door gebruik te maken van BSC Pro gaat u akkoord met deze voorwaarden. 
                De dienst is bedoeld voor het converteren van financiële documenten naar digitale formaten.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-navy mb-4">2. Betalingen en Abonnementen</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-fintech-bg rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold text-navy">Pay-as-you-go</h3>
                  </div>
                  <p className="text-slate text-sm">
                    Betaling per document is definitief na verwerking.
                  </p>
                </div>
                <div className="bg-fintech-bg rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Refresh className="w-5 h-5 text-success" />
                    <h3 className="font-semibold text-navy">Abonnementen</h3>
                  </div>
                  <p className="text-slate text-sm">
                    Maandelijkse abonnementen kunnen op elk moment worden opgezegd via het dashboard.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-navy mb-4">3. Aansprakelijkheid</h2>
              <div className="flex items-start gap-4 p-4 bg-warning/5 border border-warning/10 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-slate text-sm">
                  Hoewel onze AI een nauwkeurigheid van 99.3% nastreeft, is de gebruiker 
                  verantwoordelijk voor de uiteindelijke controle van de geconverteerde data 
                  voordat deze in de boekhouding wordt opgenomen. BSC Pro is niet aansprakelijk 
                  voor fouten in de administratie.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-navy mb-4">4. Fair Use</h2>
              <div className="flex items-start gap-4 p-4 bg-navy/5 rounded-xl">
                <Ban className="w-6 h-6 text-navy flex-shrink-0 mt-0.5" />
                <p className="text-slate text-sm">
                  Het Enterprise-abonnement is 'unlimited' binnen de grenzen van normaal zakelijk gebruik. 
                  Misbruik (zoals het geautomatiseerd scrapen van de API zonder toestemming) 
                  kan leiden tot blokkering.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-navy mb-4">5. Intellectueel Eigendom</h2>
              <p className="text-slate leading-relaxed">
                Alle rechten op de software, code en technologie van BSC Pro blijven eigendom van BSC Pro. 
                Gebruikers behouden alle rechten op hun eigen data en documenten.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-navy mb-4">6. Opzegging</h2>
              <p className="text-slate leading-relaxed">
                U kunt uw abonnement op elk moment opzeggen via uw dashboard. 
                Bij opzegging blijft u toegang houden tot de dienst tot het einde van de huidige factureringsperiode.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy mb-4">7. Wijzigingen</h2>
              <p className="text-slate leading-relaxed">
                Wij behouden ons het recht voor om deze voorwaarden te wijzigen. 
                Bij significante wijzigingen informeren wij u per e-mail.
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

// Icon
function Refresh({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}
