import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAnonymousStorage } from '@/lib/anonymousStorage';

// Debounce helper
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function BtwCalculator() {
  const [amount, setAmount] = useState<string>('');
  const [rate, setRate] = useState<number>(21);
  const [inclusive, setInclusive] = useState<boolean>(false);
  const [res, setRes] = useState({ btw: 0, total: 0, sub: 0 });
  const { saveCalculation } = useAnonymousStorage();

  useEffect(() => {
    const val = parseFloat(amount.replace(',', '.')) || 0;
    let newRes;
    if (inclusive) {
      const sub = val / (1 + rate / 100);
      newRes = { sub, btw: val - sub, total: val };
    } else {
      const btw = val * (rate / 100);
      newRes = { sub: val, btw, total: val + btw };
    }
    setRes(newRes);
  }, [amount, rate, inclusive]);

  // Debounced save to localStorage
  const debouncedSave = useCallback(
    debounce((amt: string, r: number, inc: boolean, result: any) => {
      if (amt && parseFloat(amt.replace(',', '.')) > 0) {
        saveCalculation('btw', {
          amount: amt,
          rate: r,
          inclusive: inc
        }, result);
      }
    }, 2000),
    [saveCalculation]
  );

  useEffect(() => {
    debouncedSave(amount, rate, inclusive, res);
  }, [amount, rate, inclusive, res, debouncedSave]);

  return (
    <>
      <Head>
        <title>BTW Calculator 2026 | BSC Pro</title>
        <meta name="description" content="Bereken BTW eenvoudig met onze gratis BTW calculator voor 21%, 9% en 0% tarieven." />
        <meta name="keywords" content="BTW berekenen 2026, ZZP BTW calculator, 21 procent BTW, 9 procent BTW" />
        
        {/* JSON-LD Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "BSC Pro BTW Calculator",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              },
              "description": "Gratis BTW calculator voor ondernemers. Bereken 21%, 9% en 0% BTW tarieven direct online.",
              "url": "https://www.bscpro.nl/tools/btw-calculator",
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
                BTW Calculator <span className="text-[#00b8d9]">2026</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Bereken snel BTW voor alle Nederlandse tarieven
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
              {/* Amount Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Bedrag (€)
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-lg font-semibold outline-none focus:border-[#00b8d9] focus:ring-2 focus:ring-[#00b8d9]/20 transition-all"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* BTW Rate Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  BTW tarief
                </label>
                <div className="flex gap-2">
                  {[21, 9, 0].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRate(r)}
                      className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                        rate === r
                          ? 'bg-[#00b8d9] text-white shadow-[0_0_15px_rgba(0,184,217,0.4)]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Inclusive Toggle */}
              <div className="mb-6 flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Bedrag is inclusief BTW
                </span>
                <button
                  onClick={() => setInclusive(!inclusive)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    inclusive ? 'bg-[#00b8d9]' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      inclusive ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Results */}
              <div className="p-5 bg-slate-900 dark:bg-black rounded-xl border border-slate-700">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Bedrag exclusief BTW:</span>
                    <span className="text-white font-semibold">€{res.sub.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">BTW ({rate}%):</span>
                    <span className="text-[#00b8d9] font-semibold">€{res.btw.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Totaal:</span>
                      <span className="text-2xl font-bold text-white">€{res.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/register"
                className="block mt-6 text-center text-[#00b8d9] font-bold hover:underline"
              >
                Scan factuur met AI →
              </Link>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-white">21%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Hoog tarief</div>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-white">9%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Laag tarief</div>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-white">0%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Vrijgesteld</div>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <article className="max-w-2xl mx-auto py-12 text-slate-700 dark:text-slate-300">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              BTW Berekenen in 2026: Snel, Foutloos en Efficiënt
            </h2>
            <p className="mb-4 leading-relaxed">
              Het handmatig uitrekenen van BTW-bedragen is voor veel ondernemers een dagelijkse bron van kleine frustraties en foutjes. Of je nu van inclusief naar exclusief BTW wilt rekenen of de nieuwe tarieven voor 2026 moet toepassen; nauwkeurigheid is essentieel voor je kwartaalaangifte bij de Belastingdienst. Onze gratis BTW Calculator is speciaal ontwikkeld voor ZZP'ers en MKB-ondernemers die direct resultaat willen zonder ingewikkelde formules.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
              Hoe werkt de BTW Calculator?
            </h3>
            <ol className="list-decimal list-inside space-y-2 mb-6">
              <li><strong>Voer het bedrag in:</strong> Typ het bedrag dat je op je factuur of bonnetje ziet staan.</li>
              <li><strong>Kies het tarief:</strong> Selecteer 21% (hoog), 9% (laag) of 0% BTW.</li>
              <li><strong>Inclusief of Exclusief:</strong> Geef aan of het ingevoerde bedrag al BTW bevat of dat dit er nog bovenop moet.</li>
              <li><strong>Direct resultaat:</strong> De tool splitst direct het subtotaal, het BTW-bedrag en het totaalbedrag voor je uit.</li>
            </ol>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
              Van BTW Berekenen naar Automatische Boekhouding
            </h3>
            <p className="mb-4 leading-relaxed">
              Hoewel een calculator handig is voor een snelle check, kost het handmatig overtypen van factuurgegevens naar je boekhoudpakket nog steeds uren per maand. In 2026 is dat niet meer nodig.
            </p>
            <p className="mb-4 leading-relaxed">
              BSC PRO gaat verder waar de calculator stopt. Onze AI-gedreven Document Scanner leest je PDF-facturen en bonnetjes automatisch uit.
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li><strong>Bespaar tijd:</strong> Geen handmatige invoer meer.</li>
              <li><strong>ISO-Standaard:</strong> Exporteer direct naar CAMT.053 voor naadloze integratie met Moneybird, Exact Online of e-Boekhouden.nl.</li>
              <li><strong>Foutloos:</strong> Onze AI herkent bedragen, BTW-percentages en factuurnummers met 99,5% nauwkeurigheid.</li>
            </ul>

            <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Stop met typen en start met scannen.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-[#00b8d9] font-bold hover:underline"
              >
                Probeer BSC PRO vandaag nog →
              </Link>
            </div>
          </article>
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
