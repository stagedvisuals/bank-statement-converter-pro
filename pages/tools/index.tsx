import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Calculator, Calendar, Car, ArrowRight, Sparkles, Check } from 'lucide-react';

interface CalculationHistory {
  id: string;
  type: 'btw' | 'deadline';
  input: string;
  result: string;
  date: string;
}

export default function ToolsHub() {
  const [history, setHistory] = useState<CalculationHistory[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bscpro_tools_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const tools = [
    {
      icon: Calculator,
      title: 'BTW Calculator',
      description: 'Bereken snel BTW-bedragen voor 21%, 9% en 0% tarieven. Van exclusief naar inclusief en vice versa.',
      href: '/tools/btw-calculator',
      color: 'cyan',
      popular: true
    },
    {
      icon: Calendar,
      title: 'Factuur Deadline Checker',
      description: 'Bereken automatisch de vervaldatum van je facturen. Checkt op weekenden en feestdagen.',
      href: '/tools/factuur-deadline-checker',
      color: 'blue',
      popular: false
    },
    {
      icon: Car,
      title: 'Kilometervergoeding Calculator',
      description: 'Bereken je onbelaste kilometervergoeding voor 2026. Controleer fiscale grenzen en retourritten.',
      href: '/tools/kilometervergoeding-calculator',
      color: 'green',
      popular: false
    }
  ];

  return (
    <>
      <Head>
        <title>Gratis Tools voor Ondernemers | BSC Pro</title>
        <meta name="description" content="Gratis BTW calculator en factuur deadline checker voor ZZP'ers en MKB. Bespaar tijd met onze slimme tools." />
        
        {/* JSON-LD Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "item": {
                    "@type": "SoftwareApplication",
                    "name": "BTW Calculator 2026",
                    "description": "Gratis BTW calculator voor ondernemers. Bereken 21%, 9% en 0% BTW tarieven direct online.",
                    "url": "https://www.bscpro.nl/tools/btw-calculator",
                    "applicationCategory": "FinanceApplication",
                    "offers": {
                      "@type": "Offer",
                      "price": "0",
                      "priceCurrency": "EUR"
                    }
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "item": {
                    "@type": "SoftwareApplication",
                    "name": "Factuur Deadline Checker",
                    "description": "Gratis factuur deadline checker voor ondernemers. Bereken vervaldatums en check op weekenden.",
                    "url": "https://www.bscpro.nl/tools/factuur-deadline-checker",
                    "applicationCategory": "FinanceApplication",
                    "offers": {
                      "@type": "Offer",
                      "price": "0",
                      "priceCurrency": "EUR"
                    }
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "item": {
                    "@type": "SoftwareApplication",
                    "name": "Kilometervergoeding Calculator 2026",
                    "description": "Gratis kilometervergoeding calculator voor ondernemers. Bereken onbelaste vergoedingen en controleer fiscale grenzen.",
                    "url": "https://www.bscpro.nl/tools/kilometervergoeding-calculator",
                    "applicationCategory": "FinanceApplication",
                    "offers": {
                      "@type": "Offer",
                      "price": "0",
                      "priceCurrency": "EUR"
                    }
                  }
                }
              ]
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-white dark:bg-[#080d14]">
        <Navbar />

        <main className="pt-28 pb-20 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Gratis Tools voor <span className="text-[#00b8d9]">Ondernemers</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Bespaar tijd met onze slimme calculators en checkers. 
                Wil je meer? Upgrade naar het ZZP Plan voor €15/maand.
              </p>
            </div>

            {/* Tools Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group block p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#00b8d9] hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${tool.color}-500/10 flex items-center justify-center`}>
                      <tool.icon className="w-6 h-6 text-[#00b8d9]" />
                    </div>
                    {tool.popular && (
                      <span className="px-3 py-1 bg-[#00b8d9]/10 text-[#00b8d9] text-xs font-semibold rounded-full">
                        Populair
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#00b8d9] transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center text-[#00b8d9] font-semibold">
                    Gebruik tool
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-[#00b8d9]/10 to-blue-500/10 border border-[#00b8d9]/30 rounded-2xl p-8 text-center">
              <Sparkles className="w-10 h-10 text-[#00b8d9] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Wil je deze berekeningen opslaan?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
                Met het ZZP Plan krijg je toegang tot het Smart Tools dashboard, 
                waar je je laatste 50 berekeningen kunt opslaan en terugkijken.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-[#00b8d9] text-[#080d14] font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,184,217,0.4)] transition-all"
                >
                  Start ZZP Plan voor €15/maand
                </Link>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Tijdelijke actie - daarna €22,50
                </span>
              </div>
            </div>

            {/* Features Comparison */}
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Gratis Tools
                </h3>
                <ul className="space-y-3">
                  {[
                    'BTW Calculator (21%, 9%, 0%)',
                    'Factuur Deadline Checker',
                    'Kilometervergoeding Calculator',
                    'Direct resultaat',
                    'Geen registratie nodig'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <Check className="w-5 h-5 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 bg-[#00b8d9]/5 rounded-2xl border border-[#00b8d9]/30">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  ZZP Plan (€15/maand)
                </h3>
                <ul className="space-y-3">
                  {[
                    'Alle gratis tools',
                    'Geschiedenis opslaan (50 berekeningen)',
                    'Smart Tools dashboard',
                    'PDF factuur scanner (50/maand)',
                    'Excel/CSV/MT940 export',
                    'BTW categorisering'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <Check className="w-5 h-5 text-[#00b8d9]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
