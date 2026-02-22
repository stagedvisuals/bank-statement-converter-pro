import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, Shield, Server, Brain, FileCheck } from 'lucide-react'

export default function GDPR() {
  return (
    <div className="min-h-screen bg-fintech-bg">
      <Head>
        <title>GDPR / AVG Verklaring | BSC Pro - Bank Statement Converter</title>
        <meta name="description" content="GDPR en AVG verklaring van Bank Statement Converter Pro. Data veiligheid en compliance." />
        <link rel="canonical" href="https://www.bscpro.nl/gdpr/" />
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
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-navy">GDPR / AVG Verklaring</h1>
              <p className="text-slate">Data Veiligheid & Compliance</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <div className="bg-success/5 border border-success/10 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-bold text-success-dark mb-2">Onze belofte aan u</h2>
              <p className="text-slate">
                Uw financiële data is veilig bij ons. Wij behandelen uw informatie met hetzelfde 
                respect en dezelfde zorg als onze eigen data.
              </p>
            </div>

            <section className="mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy mb-2">Minimale Data Opslag</h2>
                  <p className="text-slate leading-relaxed">
                    Wij slagen alleen op wat strikt noodzakelijk is. Uw geüploade PDF's worden 
                    na verwerking direct gemarkeerd voor verwijdering. Na 24 uur zijn ze definitief 
                    verwijderd van al onze servers.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Server className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy mb-2">EU Server Locatie</h2>
                  <p className="text-slate leading-relaxed">
                    Al onze dataverwerking vindt plaats op servers binnen de EU (Frankrijk/Duitsland), 
                    volledig in lijn met de AVG-wetgeving. Uw data verlaat nooit het Europese economische gebied.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy mb-2">Geen AI Training</h2>
                  <p className="text-slate leading-relaxed">
                    In tegenstelling tot andere tools, gebruiken wij uw persoonlijke financiële data 
                    <strong className="text-navy"> niet</strong> om onze algemene AI-modellen te trainen. 
                    Uw data blijft van u en wordt alleen gebruikt voor uw eigen conversies.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy mb-2">Verwerkersovereenkomst</h2>
                  <p className="text-slate leading-relaxed">
                    Voor zakelijke klanten (Business/Enterprise) fungeert deze verklaring als basis 
                    voor de wettelijk vereiste verwerkersovereenkomst. Neem contact op voor een 
                    ondertekende versie.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-navy mb-4">Uw AVG Rechten</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-fintech-bg rounded-xl p-4">
                  <h3 className="font-semibold text-navy mb-1">Recht op inzage</h3>
                  <p className="text-slate text-sm">Bekijk welke data wij van u hebben</p>
                </div>
                <div className="bg-fintech-bg rounded-xl p-4">
                  <h3 className="font-semibold text-navy mb-1">Recht op correctie</h3>
                  <p className="text-slate text-sm">Laat foutieve data corrigeren</p>
                </div>
                <div className="bg-fintech-bg rounded-xl p-4">
                  <h3 className="font-semibold text-navy mb-1">Recht op verwijdering</h3>
                  <p className="text-slate text-sm">Laat uw data verwijderen ("recht om vergeten te worden")</p>
                </div>
                <div className="bg-fintech-bg rounded-xl p-4">
                  <h3 className="font-semibold text-navy mb-1">Recht op dataportabiliteit</h3>
                  <p className="text-slate text-sm">Ontvang uw data in een machine-leesbaar format</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy mb-4">Contact DPO</h2>
              <p className="text-slate leading-relaxed">
                Voor vragen over GDPR/AVG compliance kunt u contact opnemen met onze Functionaris voor de Gegevensbescherming via{' '}
                <a href="mailto:dpo@bscpro.ai" className="text-success hover:underline">
                  dpo@bscpro.ai
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

// Icon
function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
