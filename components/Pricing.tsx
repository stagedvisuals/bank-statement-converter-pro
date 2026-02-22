'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Kies Je Plan
          </h2>
          <p className="text-slate text-lg">Flexibel. Geen verborgen kosten. Altijd opzegbaar.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl p-8 card-shadow border border-fintech-border hover:card-shadow-hover transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-navy mb-2">Basic</h3>
              <p className="text-slate text-sm">Pay-as-you-go</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-navy">€2</span>
              <span className="text-slate"> per document</span>
            </div>
            <p className="text-sm text-slate mb-6">Geen abonnement. Minimale afname 2 docs.</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span>Per document betalen</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span>Excel & CSV export</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span>Email support</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span>24u data-delete</span>
              </li>
            </ul>
            <Link 
              href="/register" 
              className="block w-full py-3 text-center border-2 border-fintech-border text-navy font-semibold rounded-xl hover:bg-fintech-bg transition-all"
            >
              Start Basic
            </Link>
          </div>

          {/* Business Plan - Popular */}
          <div className="bg-white rounded-2xl p-8 card-shadow border-2 border-success relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-success text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
              MEEST GEKOZEN
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-navy mb-2">Business</h3>
              <p className="text-slate text-sm">Voor ZZP'ers & MKB</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-navy">€15</span>
              <span className="text-slate">/maand</span>
            </div>
            <p className="text-sm text-slate mb-6">Tot 50 conversies per maand. Alles in Basic plus:</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span className="font-semibold text-navy">50 conversies/maand</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span>Batch-processing (meerdere docs)</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span>Directe export naar boekhouding</span>
              </li>
            </ul>
            <Link 
              href="/register" 
              className="block w-full py-3 text-center bg-success text-white font-bold rounded-xl hover:bg-success-dark transition-all hover:shadow-glow"
            >
              Start Business
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl p-8 card-shadow border border-fintech-border hover:card-shadow-hover transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-navy mb-2">Enterprise</h3>
              <p className="text-slate text-sm">Voor accountants & grootgebruikers</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-navy">€30</span>
              <span className="text-slate">/maand</span>
            </div>
            <p className="text-sm text-slate mb-6">Onbeperkt. Volledige AI API. Alles in Business plus:</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span className="font-semibold text-navy">Onbeperkte conversies</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span>API voor automatische categorisatie</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span>JSON export met AI risk scores</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span>Directe export: Twinfield, Exact, SnelStart</span>
              </li>
            </ul>
            <a 
              href="mailto:support@bscpro.ai?subject=Enterprise%20Plan%20Aanvraag" 
              className="block w-full py-3 text-center border-2 border-navy text-navy font-semibold rounded-xl hover:bg-navy hover:text-white transition-all"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
