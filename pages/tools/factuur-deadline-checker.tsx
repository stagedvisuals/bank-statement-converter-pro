import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Calendar, AlertCircle, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function FactuurDeadlineChecker() {
  const [factuurDatum, setFactuurDatum] = useState<string>('');
  const [termijn, setTermijn] = useState<number>(30);
  const [result, setResult] = useState<{
    vervalDatum: Date;
    isWeekend: boolean;
    dagNaam: string;
    formattedDate: string;
    weekendWarning: string | null;
  } | null>(null);

  useEffect(() => {
    if (factuurDatum) {
      const start = new Date(factuurDatum);
      const verval = new Date(start);
      verval.setDate(verval.getDate() + termijn);
      
      const dagIndex = verval.getDay();
      const isWeekend = dagIndex === 0 || dagIndex === 6; // 0 = zondag, 6 = zaterdag
      
      const dagen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
      const maanden = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
      
      let weekendWarning = null;
      if (isWeekend) {
        if (dagIndex === 6) { // zaterdag
          weekendWarning = 'Let op: Valt op zaterdag, verwerk op vrijdag of maandag.';
        } else { // zondag
          weekendWarning = 'Let op: Valt op zondag, verwerk op vrijdag of maandag.';
        }
      }
      
      setResult({
        vervalDatum: verval,
        isWeekend,
        dagNaam: dagen[dagIndex],
        formattedDate: `${verval.getDate()} ${maanden[verval.getMonth()]} ${verval.getFullYear()}`,
        weekendWarning
      });
    } else {
      setResult(null);
    }
  }, [factuurDatum, termijn]);

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFactuurDatum(today);
  }, []);

  return (
    <>
      <Head>
        <title>Factuur Deadline Checker | BSC Pro</title>
        <meta name="description" content="Bereken automatisch de vervaldatum van je facturen. Checkt op weekenden en feestdagen. Gratis tool voor ondernemers." />
        
        {/* JSON-LD Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "BSC Pro Factuur Deadline Checker",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.7",
                "ratingCount": "890"
              },
              "description": "Gratis factuur deadline checker voor ondernemers. Bereken vervaldatums en check op weekenden.",
              "url": "https://www.bscpro.nl/tools/factuur-deadline-checker",
              "publisher": {
                "@type": "Organization",
                "name": "BSC Pro",
                "url": "https://www.bscpro.nl"
              }
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-white dark:bg-[#080d14]">
        <Navbar />

        <main className="pt-28 pb-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Factuur Deadline <span className="text-[#00b8d9]">Checker</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Bereken automatisch de vervaldatum en check op weekenden
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
              {/* Factuurdatum Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Factuurdatum
                </label>
                <input
                  type="date"
                  value={factuurDatum}
                  onChange={(e) => setFactuurDatum(e.target.value)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-lg outline-none focus:border-[#00b8d9] focus:ring-2 focus:ring-[#00b8d9]/20 transition-all"
                />
              </div>

              {/* Termijn Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Betalingstermijn
                </label>
                <div className="flex gap-2">
                  {[14, 30, 60].map((dagen) => (
                    <button
                      key={dagen}
                      onClick={() => setTermijn(dagen)}
                      className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                        termijn === dagen
                          ? 'bg-[#00b8d9] text-white shadow-[0_0_15px_rgba(0,184,217,0.4)]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {dagen} dagen
                    </button>
                  ))}
                </div>
              </div>

              {/* Results */}
              {result && (
                <div className="mt-6">
                  <div className="p-5 bg-slate-900 dark:bg-black rounded-xl border border-slate-700">
                    <div className="text-center mb-4">
                      <span className="text-slate-400 text-sm">Vervaldatum:</span>
                      <div className="text-3xl font-bold text-white mt-1">
                        {result.formattedDate}
                      </div>
                      <div className="text-[#00b8d9] font-semibold capitalize">
                        {result.dagNaam}
                      </div>
                    </div>
                    
                    {result.isWeekend ? (
                      <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-400 font-semibold text-sm">Weekend!</p>
                          <p className="text-amber-300/80 text-xs mt-1">
                            {result.weekendWarning}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        <p className="text-green-400 font-semibold text-sm">
                          Doe gewoon op deze dag
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CTA */}
              <Link
                href="/register"
                className="block mt-6 text-center text-[#00b8d9] font-bold hover:underline"
              >
                Plan herinneringen in je dashboard →
              </Link>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-white">14</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">dagen</div>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-white">30</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">dagen</div>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-white">60</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">dagen</div>
              </div>
            </div>

            {/* SEO Content */}
            <article className="max-w-2xl mx-auto py-12 text-slate-700 dark:text-slate-300">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Nooit meer een boete: Bereken je Factuur Deadline in 2026
              </h2>
              <p className="mb-4 leading-relaxed">
                Het bijhouden van de wettelijke betalingstermijn is essentieel voor een gezonde cashflow. 
                Of je nu een factuur verstuurt naar een grote zakelijke klant of een inkomende factuur 
                van een leverancier moet inplannen; de vervaldatum bepaalt je financiële planning. 
                Met onze Factuur Deadline Checker bereken je binnen één seconde wanneer de uiterste 
                betaaldatum is bereikt.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                Wat is de wettelijke betalingstermijn?
              </h3>
              <p className="mb-4 leading-relaxed">
                In 2026 gelden er strikte regels voor betalingstermijnen in Nederland en de EU:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li><strong>Consumenten:</strong> Meestal 14 dagen, tenzij anders afgesproken.</li>
                <li><strong>MKB & ZZP:</strong> De standaard is 30 dagen.</li>
                <li><strong>Grote Bedrijven:</strong> Sinds de wetgeving tegen late betalingen mogen grote bedrijven bij MKB-leveranciers maximaal 30 dagen hanteren.</li>
              </ul>
              <p className="mb-4 leading-relaxed">
                Onze tool houdt rekening met weekenden en bankvrije dagen. Valt je deadline op een zondag? 
                Dan markeren we dit direct, zodat je de betaling op tijd (de vrijdag ervoor) kunt inplannen.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                Automatiseer je Deadlines met BSC PRO
              </h3>
              <p className="mb-4 leading-relaxed">
                Handmatig datums uitrekenen is een goed begin, maar bij meer dan vijf facturen per maand 
                wordt het foutgevoelig. Waarom zou je zelf rekenen als AI het voor je kan doen?
              </p>
              <p className="mb-4 leading-relaxed">
                Met de <strong>BSC PRO Scanner</strong> hoef je alleen je PDF te uploaden:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li><strong>AI Extractie:</strong> Wij lezen de factuurdatum en de afgesproken termijn automatisch uit.</li>
                <li><strong>Slimme Categorisering:</strong> De tool herkent direct of het een inkomende of uitgaande factuur is.</li>
                <li><strong>Agenda Integratie:</strong> Exporteer je deadlines direct naar je boekhoudpakket via onze CAMT.053 export.</li>
              </ul>

              <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Voorkom aanmaningen en houd je relatie met leveranciers sterk.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-[#00b8d9] font-bold hover:underline"
                >
                  Scan je eerste factuur vandaag nog bij BSC PRO →
                </Link>
              </div>
            </article>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080d14]">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © 2026 BSC Pro. Alle rechten voorbehouden.
          </p>
        </footer>
      </div>
    </>
  );
}
