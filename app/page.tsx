'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Lock,
  Upload,
  Check,
  FileSpreadsheet,
  Database,
  Star,
  Users,
  Quote,
  Zap,
  TrendingUp,
  Calculator
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import DemoSection from './sections/DemoSection';

export default function Home() {
  const [statements, setStatements] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [enterpriseEmail, setEnterpriseEmail] = useState('');
  const [enterpriseSubmitted, setEnterpriseSubmitted] = useState(false)
  const [enterpriseLoading, setEnterpriseLoading] = useState(false);
  
  const manualHours = Math.ceil(statements * 1.5);
  const bscProMinutes = Math.ceil(statements * 0.5);
  const hoursSaved = Math.max(0, manualHours - (bscProMinutes / 60));
  const moneySaved = Math.round(hoursSaved * hourlyRate);

  const handleEnterpriseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnterpriseLoading(true)
    try {
      await fetch('/api/enterprise-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: enterpriseEmail })
      })
    } catch {}
    setEnterpriseSubmitted(true)
    setEnterpriseEmail('')
    setEnterpriseLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8 px-4">
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1.5 flex items-center gap-1.5 shrink-0">
                <span className="text-sm">🔒</span>
                <span className="text-xs font-semibold text-foreground whitespace-nowrap">Veilig & AVG-proof</span>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1.5 flex items-center gap-1.5 shrink-0">
                <span className="text-sm">🏦</span>
                <span className="text-xs font-semibold text-foreground whitespace-nowrap">Ondersteunt alle NL banken</span>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1.5 flex items-center gap-1.5 shrink-0">
                <span className="text-sm">📄</span>
                <span className="text-xs font-semibold text-foreground whitespace-nowrap">MT940 & CAMT.053</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>
              Converteer bankafschriften <span className="text-[#00b8d9]">in seconden</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload je PDF, laat onze AI de transacties uitlezen, en download direct een Excel/CSV of MT940 bestand. Geen copy-paste meer.
            </p>

            <div className="flex flex-col items-center gap-4 mb-8">
              <Link href="/register">
                <button className="bg-[#00b8d9] text-[#080d14] rounded-md px-8 py-4 text-base font-semibold flex items-center gap-2 cursor-pointer hover:shadow-[0_0_30px_rgba(0,184,217,0.3)]">
                  <Upload className="w-5 h-5" />
                  Probeer het gratis
                </button>
              </Link>
              <span className="text-sm text-muted-foreground">Geen creditcard nodig</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#00b8d9]" />
                <span>AVG-proof</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#00b8d9]" />
                <span>Hoge nauwkeurigheid - controleer altijd zelf</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#00b8d9]" />
                <span>24/7 beschikbaar</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              * Resultaten kunnen variëren. Controleer altijd je eigen data.
            </p>
          </div>
        </div>
      </section>

            {/* Logos Bar */}
      <section className="py-6 bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground mb-4">Ondersteunt alle Nederlandse banken</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-60">
            {['ING', 'Rabobank', 'ABN AMRO', 'SNS', 'Bunq', 'Triodos'].map((bank) => (
              <span key={bank} className="text-lg font-bold text-muted-foreground">{bank}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Hoe werkt het?</h2>
            <p className="text-muted-foreground text-base">Van PDF naar Excel in minder dan een minuut</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Upload, title: 'Upload je PDF', desc: 'Sleep je PDF bankafschrift naar onze tool. Alle Nederlandse banken ondersteund.' },
              { icon: Zap, title: 'AI verwerkt automatisch', desc: 'Onze AI herkent transacties, datums en bedragen. Controleer altijd zelf.' },
              { icon: FileSpreadsheet, title: 'Download Excel/CSV/MT940', desc: 'Met automatische categorisering, BTW-overzicht en MT940 export.' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border-2 border-[#00b8d9] flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-[#00b8d9]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠️ <strong>Belangrijk:</strong> BSCPro is een ondersteunend hulpmiddel. Controleer alle uitgelezen transactiedata altijd zelf voordat je deze gebruikt voor boekhouding of belastingaangifte. BSCPro is niet aansprakelijk voor fouten in de output.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <DemoSection />

      {/* Features Grid */}
      <section id="features" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Waarom kiezen voor BSC<span className="text-[#00b8d9]">PRO</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Clock, title: 'Direct resultaat', desc: 'Upload je PDF en binnen 10 seconden heb je een Excel bestand' },
              { icon: Shield, title: 'Veilig & AVG-proof', desc: 'Je data wordt na 24 uur automatisch verwijderd.' },
              { icon: CheckCircle, title: 'Hoge nauwkeurigheid', desc: 'Onze AI herkent complexe bankafschriften. Controleer altijd zelf.' },
              { icon: Database, title: 'MT940 Export', desc: 'Als enige in NL: directe MT940 export voor alle boekhoudpakketten', highlight: true },
              { icon: TrendingUp, title: 'Automatisch gecategoriseerd', desc: 'Transacties worden direct gesorteerd. BTW-aangifte in minuten.', highlight: true },
            ].map((feature) => (
              <div key={feature.title} className={`p-5 rounded-xl border ${feature.highlight ? 'bg-cyan-500/10 border-[#00b8d9]/50' : 'bg-card border-border'}`}>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-[#00b8d9]" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="calculator" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Bereken je tijdsbesparing</h2>
              <p className="text-muted-foreground">Hoeveel kost het je nu écht om bankafschriften handmatig over te typen?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Aantal afschriften per maand</label>
                  <input 
                    type="range" min="5" max="200" value={statements} onChange={(e) => setStatements(Number(e.target.value))}
                    className="w-full accent-[#00b8d9]" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>5</span>
                    <span className="text-[#00b8d9] font-semibold text-lg">{statements}</span>
                    <span>200</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Uurtarief (€)</label>
                  <input 
                    type="range" min="40" max="150" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full accent-[#00b8d9]" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>€40</span>
                    <span className="text-[#00b8d9] font-semibold text-lg">€{hourlyRate}</span>
                    <span>€150</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary rounded-xl p-6 border border-border">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Handmatig</p>
                    <p className="text-2xl font-bold text-foreground">{manualHours}u</p>
                    <p className="text-xs text-muted-foreground">per maand</p>
                  </div>
                  <div className="p-4 rounded-lg bg-cyan-500/10 border border-[#00b8d9]/30">
                    <p className="text-sm text-muted-foreground mb-1">Met BSC Pro</p>
                    <p className="text-2xl font-bold text-[#00b8d9]">{bscProMinutes}min</p>
                    <p className="text-xs text-muted-foreground">per maand</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Jouw besparing per maand</p>
                  <p className="text-4xl font-bold text-[#00b8d9]">€{moneySaved}</p>
                  <p className="text-xs text-muted-foreground mt-1">{Math.round(hoursSaved)} uur vrij voor andere taken</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      {/* Pricing */}
      {/* Pricing */}
      <section id="pricing" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              ✅ 14 dagen niet goed, geld terug — geen vragen gesteld
            </span>
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">Kies je abonnement</h2>
          <p className="text-center text-muted-foreground mb-12">
            Altijd zonder verborgen kosten. Maandelijks opzegbaar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-start">
            {/* LOSSE SCAN */}
            <div className="border border-border rounded-2xl p-6 bg-card flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-1">Losse Scan</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">€4,95</span>
                  <span className="text-muted-foreground text-sm">per scan</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Eenmalig, geen abonnement</p>
              </div>
              <ul className="space-y-2 flex-1 mb-6 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>1 PDF conversie</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Excel, CSV en MT940 export</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Directe verwerking</span></li>
                <li className="flex items-start gap-2"><span className="text-muted-foreground shrink-0">✗</span><span className="text-muted-foreground">CAMT.053 en QBO</span></li>
                <li className="flex items-start gap-2"><span className="text-muted-foreground shrink-0">✗</span><span className="text-muted-foreground">BTW categorisering</span></li>
              </ul>
              <a href="/register" className="block text-center px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">Direct kopen</a>
            </div>

            {/* STARTER */}
            <div className="border border-border rounded-2xl p-6 bg-card flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-1">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">€12</span>
                  <span className="text-muted-foreground text-sm">/maand</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">ZZP'er met 1-2 bankrekeningen</p>
              </div>
              <ul className="space-y-2 flex-1 mb-6 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>15 scans per maand</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Excel, CSV en MT940 export</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Email support</span></li>
                <li className="flex items-start gap-2"><span className="text-muted-foreground shrink-0">✗</span><span className="text-muted-foreground">CAMT.053 en QBO</span></li>
                <li className="flex items-start gap-2"><span className="text-muted-foreground shrink-0">✗</span><span className="text-muted-foreground">BTW categorisering</span></li>
              </ul>
              <a href="/register" className="block text-center px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">Start 14-daagse trial</a>
              <p className="text-xs text-muted-foreground text-center mt-2">✅ 14 dagen geld-terug-garantie</p>
            </div>

            {/* PRO */}
            <div className="border-2 border-[#00b8d9] rounded-2xl p-6 bg-card flex flex-col relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-[#00b8d9] text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">⭐ Meest populair</span>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-1">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">€29</span>
                  <span className="text-muted-foreground text-sm">/maand</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Actieve ZZP'er of kleine boekhouder</p>
              </div>
              <ul className="space-y-2 flex-1 mb-6 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>100 scans per maand</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Alle formaten: Excel, CSV, MT940, CAMT.053, QBO</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>BTW categorisering automatisch</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Bulk upload tot 5 PDFs tegelijk</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Prioriteit email support</span></li>
              </ul>
              <a href="/register" className="block text-center px-4 py-2.5 bg-[#00b8d9] text-black rounded-lg text-sm font-bold hover:bg-[#00a8c9] transition-colors">Start 14-daagse trial</a>
              <p className="text-xs text-muted-foreground text-center mt-2">✅ 14 dagen geld-terug-garantie</p>
            </div>

            {/* BUSINESS */}
            <div className="border border-border rounded-2xl p-6 bg-card flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-1">Business</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">€69</span>
                  <span className="text-muted-foreground text-sm">/maand</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Boekhouder met meerdere klanten</p>
              </div>
              <ul className="space-y-2 flex-1 mb-6 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>500 scans per maand</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Alle formaten incl. CAMT.053 en QBO</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>BTW categorisering automatisch</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Bulk upload tot 25 PDFs tegelijk</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>3 gebruikers inbegrepen</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>API toegang</span></li>
              </ul>
              <a href="/register" className="block text-center px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">Start 14-daagse trial</a>
              <p className="text-xs text-muted-foreground text-center mt-2">✅ 14 dagen geld-terug-garantie</p>
            </div>

            {/* ENTERPRISE */}
            <div className="border border-border rounded-2xl p-6 bg-card flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-1">Enterprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">€199</span>
                  <span className="text-muted-foreground text-sm">/maand</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Accountantskantoren en grote teams</p>
              </div>
              <ul className="space-y-2 flex-1 mb-6 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Onbeperkt scans</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Alle formaten + toekomstige formaten</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Onbeperkte bulk upload</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Tot 10 gebruikers</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>API toegang + webhooks</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>White-label optie</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>SLA 99,9% uptime garantie</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span><span>Dedicated accountmanager</span></li>
              </ul>
              {enterpriseSubmitted ? (
                <p className="text-green-600 dark:text-green-400 text-sm font-medium text-center py-2">
                  ✅ We nemen binnen 2 werkdagen contact op!
                </p>
              ) : (
                <form onSubmit={handleEnterpriseSubmit} className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">Interesse? Laat je email achter:</p>
                  <input 
                    type="email" 
                    placeholder="jouw@email.nl" 
                    value={enterpriseEmail} 
                    onChange={(e) => setEnterpriseEmail(e.target.value)} 
                    required 
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#00b8d9]" 
                  />
                  <button 
                    type="submit" 
                    disabled={enterpriseLoading} 
                    className="w-full px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {enterpriseLoading ? 'Bezig...' : 'Zet me op de wachtlijst →'}
                  </button>
                  <p className="text-xs text-muted-foreground text-center">We reageren binnen 2 werkdagen</p>
                </form>
              )}
            </div>
          </div>

          {/* VERGELIJKINGSTABEL */}
          <div className="mt-16 overflow-x-auto">
            <h3 className="text-xl font-bold text-center mb-6">Gedetailleerde vergelijking</h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Functie</th>
                  <th className="text-center py-3 px-4 font-medium">Losse Scan</th>
                  <th className="text-center py-3 px-4 font-medium">Starter</th>
                  <th className="text-center py-3 px-4 font-medium text-[#00b8d9]">Pro</th>
                  <th className="text-center py-3 px-4 font-medium">Business</th>
                  <th className="text-center py-3 px-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50"><td className="py-3 px-4 font-medium">Prijs</td><td className="text-center py-3 px-4">€4,95</td><td className="text-center py-3 px-4">€12/mnd</td><td className="text-center py-3 px-4 font-medium text-[#00b8d9]">€29/mnd</td><td className="text-center py-3 px-4">€69/mnd</td><td className="text-center py-3 px-4">€199/mnd</td></tr>
                <tr className="border-b border-border/50 bg-muted/20"><td className="py-3 px-4">Scans</td><td className="text-center py-3 px-4">1</td><td className="text-center py-3 px-4">15/mnd</td><td className="text-center py-3 px-4 font-medium">100/mnd</td><td className="text-center py-3 px-4">500/mnd</td><td className="text-center py-3 px-4">Onbeperkt</td></tr>
                <tr className="border-b border-border/50"><td className="py-3 px-4">Excel / CSV / MT940</td><td className="text-center py-3 px-4 text-green-500">✓</td><td className="text-center py-3 px-4 text-green-500">✓</td><td className="text-center py-3 px-4 text-green-500">✓</td><td className="text-center py-3 px-4 text-green-500">✓</td><td className="text-center py-3 px-4 text-green-500">✓</td></tr>
                <tr className="border-b border-border/50 bg-muted/20"><td className="py-3 px-4">CAMT.053 export</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-green-500">✓</td><td className="text-center py-3 px-4 text-green-500">✓</td><td className="text-center py-3 px-4 text-green-500">✓</td></tr>
                <tr className="border-b border-border/50"><td className="py-3 px-4">QBO (QuickBooks)</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-green-500">✓</td><td className="text-center py-3 px-4 text-green-500">✓</td><td className="text-center py-3 px-4 text-green-500">✓</td></tr>
                <tr className="border-b border-border/50 bg-muted/20"><td className="py-3 px-4">BTW categorisering</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-green-500">✓</td><td className="text-center py-3 px-4 text-green-500">✓</td><td className="text-center py-3 px-4 text-green-500">✓</td></tr>
                <tr className="border-b border-border/50"><td className="py-3 px-4">Bulk upload</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4">Max 5</td><td className="text-center py-3 px-4">Max 25</td><td className="text-center py-3 px-4">Onbeperkt</td></tr>
                <tr className="border-b border-border/50 bg-muted/20"><td className="py-3 px-4">Gebruikers</td><td className="text-center py-3 px-4">1</td><td className="text-center py-3 px-4">1</td><td className="text-center py-3 px-4">1</td><td className="text-center py-3 px-4">3</td><td className="text-center py-3 px-4">10+</td></tr>
                <tr className="border-b border-border/50"><td className="py-3 px-4">API toegang</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-green-500">✓</td><td className="text-center py-3 px-4 text-green-500">✓</td></tr>
                <tr className="border-b border-border/50 bg-muted/20"><td className="py-3 px-4">White-label</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-green-500">✓</td></tr>
                <tr className="border-b border-border/50"><td className="py-3 px-4">SLA uptime</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-muted-foreground">✗</td><td className="text-center py-3 px-4 text-green-500">99,9%</td></tr>
                <tr className="border-b border-border/50 bg-muted/20"><td className="py-3 px-4">Support</td><td className="text-center py-3 px-4 text-muted-foreground">—</td><td className="text-center py-3 px-4">Email</td><td className="text-center py-3 px-4">Prio email</td><td className="text-center py-3 px-4">Telefoon</td><td className="text-center py-3 px-4">Dedicated</td></tr>
                <tr><td className="py-3 px-4">Geld-terug-garantie</td><td className="text-center py-3 px-4 text-muted-foreground">—</td><td className="text-center py-3 px-4 text-green-500">14 dagen</td><td className="text-center py-3 px-4 text-green-500">14 dagen</td><td className="text-center py-3 px-4 text-green-500">14 dagen</td><td className="text-center py-3 px-4 text-green-500">14 dagen</td></tr>
              </tbody>
            </table>
          </div>

          {/* GARANTIE NOTE */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="border border-border rounded-xl p-6 bg-card">
              <h4 className="font-bold mb-2">💬 Wat als ik niet tevreden ben?</h4>
              <p className="text-muted-foreground text-sm">
                Geen probleem. We bieden 14 dagen geld-terug-garantie op alle betaalde abonnementen. Stuur een email naar info@bscpro.nl en je krijgt je geld volledig terug, geen vragen gesteld.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Veelgestelde vragen</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Welke banken worden ondersteund?', a: 'Alle Nederlandse banken: ING, Rabobank, ABN AMRO, SNS, Bunq, Triodos en meer. Zowel zakelijk als particulier.' },
              { q: 'Hoe veilig is mijn data?', a: 'Je PDF wordt versleuteld opgeslagen en na 24 uur automatisch verwijderd. We zijn AVG-compliant en versturen nooit data naar derden.' },
              { q: 'Wat is MT940 export?', a: 'MT940 is een standaardformaat voor banktransacties dat door vrijwel alle boekhoudpakketten wordt ondersteund. Je kunt het bestand direct importeren in Twinfield, Exact, AFAS en andere pakketten.' },
              { q: 'Kan ik meerdere afschriften tegelijk uploaden?', a: 'Ja! Met het Pro abonnement upload je tot 5 PDFs tegelijk, met Business tot 25 PDFs tegelijk.' },
              { q: 'Wat als ik niet tevreden ben?', a: 'Geen probleem. We bieden 14 dagen geld-terug-garantie op alle betaalde abonnementen. Stuur een email naar info@bscpro.nl en je krijgt je geld terug, geen vragen gesteld.' },
            ].map((faq, index) => (
              <div key={index} className="p-5 rounded-xl bg-card border border-border">
                <h3 className="text-base font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">Klaar om uren werk te besparen?</h2>
          <p className="text-lg text-muted-foreground mb-8">Start vandaag nog met je gratis proefperiode. Geen creditcard nodig.</p>
          <Link href="/register">
            <button className="bg-[#00b8d9] text-[#080d14] px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-[0_0_30px_rgba(0,184,217,0.4)]">
              Start gratis 14-daagse trial
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">BSC<span className="text-[#00b8d9]">PRO</span></h3>
              <p className="text-sm text-muted-foreground">De slimste manier om bankafschriften te converteren. Bespaar uren werk per maand.</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  🧪 Testfase
                </span>
                <span className="text-slate-500 text-xs">v1.0 - 27 feb 2026</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-[#00b8d9]">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-[#00b8d9]">Prijzen</Link></li>
                <li><Link href="#calculator" className="hover:text-[#00b8d9]">Besparing berekenen</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Koppelingen</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/moneybird/priverekening-pdf-importeren" className="hover:text-[#00b8d9]">PDF → Moneybird</Link></li>
                <li><Link href="/snelstart/rabobank-pdf-importeren" className="hover:text-[#00b8d9]">Rabobank → SnelStart</Link></li>
                <li><Link href="/exact-online/ing-prive-importeren" className="hover:text-[#00b8d9]">ING → Exact Online</Link></li>
                <li><Link href="/abn-amro/twinfield-importeren" className="hover:text-[#00b8d9]">ABN AMRO → Twinfield</Link></li>
                <li><Link href="/ing/afas-importeren" className="hover:text-[#00b8d9]">ING → AFAS</Link></li>
                <li><Link href="/rabobank/mt940-exporteren" className="hover:text-[#00b8d9]">Rabobank → MT940</Link></li>
                <li><Link href="/ing/mt940-exporteren" className="hover:text-[#00b8d9]">ING → MT940</Link></li>
                <li><Link href="/abn-amro/exact-online-importeren" className="hover:text-[#00b8d9]">ABN AMRO → Exact Online</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/api-docs" className="hover:text-[#00b8d9]">API Documentatie</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Juridisch</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-[#00b8d9]">Privacyverklaring</Link></li>
                <li><Link href="/voorwaarden" className="hover:text-[#00b8d9]">Algemene Voorwaarden</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">© 2026 BSC Pro. Alle rechten voorbehouden.</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              BSC PRO is een ondersteunend hulpmiddel. Controleer alle uitgelezen data altijd zelf. 
              Wij zijn geen boekhoudkantoor en geven geen fiscaal advies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
