'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#080d14' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#e8edf5' }}>
            Kies Je Plan
          </h2>
          <p className="text-lg" style={{ color: '#6b7fa3' }}>Flexibel. Geen verborgen kosten. Altijd opzegbaar.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <div className="rounded-2xl p-8 transition-all" style={{ background: 'rgba(10, 18, 32, 0.9)', border: '1px solid rgba(0, 184, 217, 0.15)' }}>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: '#e8edf5' }}>Basic</h3>
              <p className="text-sm" style={{ color: '#6b7fa3' }}>Pay-as-you-go</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: '#e8edf5' }}>€2</span>
              <span style={{ color: '#6b7fa3' }}> per document</span>
            </div>
            <p className="text-sm mb-6" style={{ color: '#6b7fa3' }}>Geen abonnement. Minimale afname 2 docs.</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span>Per document betalen</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span>Excel & CSV export</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span>Email support</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span>24u data-delete</span>
              </li>
            </ul>
            <Link 
              href="/register" 
              className="block w-full py-3 text-center font-semibold rounded-xl transition-all"
              style={{ border: '1px solid rgba(0, 184, 217, 0.3)', color: '#e8edf5', background: 'transparent' }}
            >
              Start Basic
            </Link>
          </div>

          {/* Business Plan - Popular */}
          <div className="rounded-2xl p-8 relative overflow-hidden transform md:-translate-y-4" style={{ background: 'rgba(0, 184, 217, 0.06)', border: '2px solid rgba(0, 184, 217, 0.5)' }}>
            <div className="absolute top-0 right-0 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl" style={{ background: '#00b8d9', color: '#080d14' }}>
              MEEST GEKOZEN
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: '#e8edf5' }}>Business</h3>
              <p className="text-sm" style={{ color: '#6b7fa3' }}>Voor ZZP'ers & MKB</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: '#e8edf5' }}>€15</span>
              <span style={{ color: '#6b7fa3' }}>/maand</span>
            </div>
            <p className="text-sm mb-6" style={{ color: '#6b7fa3' }}>Tot 50 conversies per maand. Alles in Basic plus:</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span className="font-semibold" style={{ color: '#e8edf5' }}>50 conversies/maand</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span>Batch-processing (meerdere docs)</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span>Directe export naar boekhouding</span>
              </li>
            </ul>
            <Link 
              href="/register" 
              className="block w-full py-3 text-center font-bold rounded-xl transition-all"
              style={{ background: '#00b8d9', color: '#080d14' }}
            >
              Start Business
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl p-8 transition-all" style={{ background: 'rgba(10, 18, 32, 0.9)', border: '1px solid rgba(0, 184, 217, 0.15)' }}>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: '#e8edf5' }}>Enterprise</h3>
              <p className="text-sm" style={{ color: '#6b7fa3' }}>Voor accountants & grootgebruikers</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: '#e8edf5' }}>€30</span>
              <span style={{ color: '#6b7fa3' }}>/maand</span>
            </div>
            <p className="text-sm mb-6" style={{ color: '#6b7fa3' }}>Onbeperkt. Whitelabel rapporten. Alles in Business plus:</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span className="font-semibold" style={{ color: '#e8edf5' }}>Onbeperkte conversies</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span>Whitelabel rapporten</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span>JSON export met AI risk scores</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: '#e8edf5' }}>
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#00b8d9' }} />
                <span>Directe export: Twinfield, Exact, SnelStart</span>
              </li>
            </ul>
            <a 
              href="mailto:support@bscpro.ai?subject=Enterprise%20Plan%20Aanvraag" 
              className="block w-full py-3 text-center font-semibold rounded-xl transition-all"
              style={{ border: '1px solid rgba(0, 184, 217, 0.3)', color: '#e8edf5', background: 'transparent' }}
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
