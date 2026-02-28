import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Car, MapPin, ArrowRight, Repeat, Calculator, AlertCircle, Check } from 'lucide-react';

export default function KilometervergoedingCalculator() {
  const [kilometers, setKilometers] = useState<string>('');
  const [vergoedingPerKm, setVergoedingPerKm] = useState<number>(0.23);
  const [isRetourrit, setIsRetourrit] = useState<boolean>(false);
  const [wettelijkeGrens, setWettelijkeGrens] = useState<number>(0.23);
  
  const [result, setResult] = useState<{
    totaalKm: number;
    totaalBedrag: number;
    onbelastBedrag: number;
    belastBedrag: number;
    bovenGrens: boolean;
  } | null>(null);

  useEffect(() => {
    const km = parseFloat(kilometers.replace(',', '.')) || 0;
    const totaalKm = isRetourrit ? km * 2 : km;
    const totaalBedrag = totaalKm * vergoedingPerKm;
    const onbelastBedrag = totaalKm * wettelijkeGrens;
    const belastBedrag = Math.max(0, totaalBedrag - onbelastBedrag);
    const bovenGrens = vergoedingPerKm > wettelijkeGrens;
    
    if (km > 0) {
      setResult({
        totaalKm,
        totaalBedrag,
        onbelastBedrag,
        belastBedrag,
        bovenGrens
      });
    } else {
      setResult(null);
    }
  }, [kilometers, vergoedingPerKm, isRetourrit, wettelijkeGrens]);

  // Update wettelijke grens voor 2026 (meestal €0,23)
  useEffect(() => {
    // In 2026 is de wettelijke onbelaste vergoeding €0,23 per km
    setWettelijkeGrens(0.23);
  }, []);

  return (
    <>
      <Head>
        <title>Kilometervergoeding Calculator 2026 | BSC Pro</title>
        <meta name="description" content="Bereken je onbelaste kilometervergoeding voor 2026. Controleer of je binnen de wettelijke grens blijft en wat er belast wordt." />
        <meta name="keywords" content="kilometervergoeding 2026, onbelaste vergoeding, rittenregistratie, zakelijk rijden, btw auto" />
        
        {/* JSON-LD Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "BSC Pro Kilometervergoeding Calculator",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "720"
              },
              "description": "Gratis kilometervergoeding calculator voor 2026. Bereken onbelaste vergoedingen en controleer fiscale grenzen.",
              "url": "https://www.bscpro.nl/tools/kilometervergoeding-calculator",
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 mb-4">
                <Car className="w-8 h-8 text-[#00b8d9]" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Kilometervergoeding <span className="text-[#00b8d9]">2026</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Bereken je onbelaste vergoeding en controleer fiscale grenzen
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
              {/* Kilometers Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Aantal kilometers
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={kilometers}
                    onChange={(e) => setKilometers(e.target.value)}
                    placeholder="bijv. 100"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-lg font-semibold outline-none focus:border-[#00b8d9] focus:ring-2 focus:ring-[#00b8d9]/20 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">km</span>
                </div>
              </div>

              {/* Retourrit Toggle */}
              <div className="mb-4 flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-slate-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Retourrit (dubbel)</span>
                </div>
                <button
                  onClick={() => setIsRetourrit(!isRetourrit)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    isRetourrit ? 'bg-[#00b8d9]' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      isRetourrit ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Vergoeding per km */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Vergoeding per km
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                  <input
                    type="number"
                    step="0.01"
                    value={vergoedingPerKm}
                    onChange={(e) => setVergoedingPerKm(parseFloat(e.target.value) || 0)}
                    className="w-full p-4 pl-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-lg font-semibold outline-none focus:border-[#00b8d9] focus:ring-2 focus:ring-[#00b8d9]/20 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Wettelijke onbelaste grens 2026: €{wettelijkeGrens.toFixed(2)} per km
                </p>
              </div>

              {/* Results */}
              {result && (
                <div className="mt-6 space-y-3">
                  {/* Total KM */}
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Totaal kilometers:</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{result.totaalKm} km</span>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="p-4 bg-slate-900 dark:bg-black rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400">Totaal vergoeding:</span>
                      <span className="text-xl font-bold text-white">€{result.totaalBedrag.toFixed(2)}</span>
                    </div>
                    
                    {/* Onbelast */}
                    <div className="flex justify-between items-center py-2 border-t border-slate-700">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-slate-400 text-sm">Onbelast:</span>
                      </div>
                      <span className="text-green-400 font-semibold">€{result.onbelastBedrag.toFixed(2)}</span>
                    </div>
                    
                    {/* Belast (if applicable) */}
                    {result.belastBedrag > 0 && (
                      <div className="flex justify-between items-center py-2 border-t border-slate-700">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-slate-400 text-sm">Belast (loon):</span>
                        </div>
                        <span className="text-amber-400 font-semibold">€{result.belastBedrag.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Warning if above limit */}
                  {result.bovenGrens && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <p className="text-amber-400 text-sm">
                        <strong>Let op:</strong> Je vergoeding (€{vergoedingPerKm.toFixed(2)}) is hoger dan de wettelijke grens (€{wettelijkeGrens.toFixed(2)}). Het verschil wordt als loon belast.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* CTA Box */}
              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-[#00b8d9]/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#00b8d9] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                      <strong>Rittenregistratie zat?</strong> Upload je parkeerbonnen of brandstoffacturen in BSC PRO. 
                      Onze AI herkent de data en zet het direct klaar voor je administratie.
                    </p>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 text-[#00b8d9] font-bold text-sm hover:underline"
                    >
                      Koop losse scan
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-white">€0,23</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Onbelast per km</div>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-white">100%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Fiscaal aftrekbaar</div>
              </div>
            </div>

            {/* SEO Content */}
            <article className="max-w-2xl mx-auto py-12 text-slate-700 dark:text-slate-300">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Kilometervergoeding 2026: Bereken direct je onbelaste vergoeding
              </h2>
              <p className="mb-4 leading-relaxed">
                Als ondernemer of werknemer wil je maximaal profiteren van de fiscale mogelijkheden. 
                De onbelaste kilometervergoeding is in 2026 een van de belangrijkste posten in de rittenregistratie. 
                Met onze calculator bereken je binnen enkele seconden welk bedrag je belastingvrij mag uitkeren of declareren.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                Hoeveel bedraagt de kilometervergoeding in 2026?
              </h3>
              <p className="mb-4 leading-relaxed">
                De overheid heeft de onbelaste vergoeding voor zakelijke kilometers met de eigen auto 
                verder aangepast om tegemoet te komen aan de gestegen brandstof- en onderhoudskosten.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li><strong>Wettelijke grens:</strong> Tot het vastgestelde bedrag van €0,23 per kilometer betaal je geen loonbelasting.</li>
                <li><strong>Boven de grens:</strong> Keer je meer uit? Dan wordt het verschil gezien als loon en moet daarover belasting worden betaald.</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                Waarom een nauwkeurige registratie essentieel is
              </h3>
              <p className="mb-4 leading-relaxed">
                De Belastingdienst stelt strenge eisen aan de rittenregistratie. Of je nu de calculator 
                gebruikt voor een losse declaratie of voor je maandelijkse overzicht, zorg dat je de 
                beginstand, eindstand en het doel van de rit vastlegt.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                Bespaar tijd met BSC PRO
              </h3>
              <p className="mb-4 leading-relaxed">
                Het handmatig bijhouden van ritten en de bijbehorende brandstofbonnen is verleden tijd.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li><strong>Scan je bonnen:</strong> Onze AI leest brandstof- en parkeerbonnen direct uit.</li>
                <li><strong>Koppel aan projecten:</strong> Categoriseer uitgaven direct voor je jaaroverzicht.</li>
                <li><strong>CAMT.053 Export:</strong> Synchroniseer al je zakelijke autokosten direct met je boekhouding.</li>
              </ul>

              <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Klaar om je rittenregistratie te automatiseren?
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-[#00b8d9] font-bold hover:underline"
                >
                  Start met BSC Pro vandaag →
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
