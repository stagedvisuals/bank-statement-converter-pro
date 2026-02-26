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

export default function Home() {
  const [statements, setStatements] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(75);
  
  const manualHours = Math.ceil(statements * 1.5);
  const bscProMinutes = Math.ceil(statements * 0.5);
  const hoursSaved = Math.max(0, manualHours - (bscProMinutes / 60));
  const moneySaved = Math.round(hoursSaved * hourlyRate);

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

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>
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
              <span className="text-sm text-muted-foreground">Je eerste 2 conversies zijn van ons</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#00b8d9]" />
                <span>AVG-proof</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#00b8d9]" />
                <span>99.5% nauwkeurig</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#00b8d9]" />
                <span>24/7 beschikbaar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Bar */}
      <section className="py-6 bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground mb-4">Vertrouwd door boekhouders uit heel Nederland</p>
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
              { icon: Zap, title: 'AI verwerkt automatisch', desc: 'Onze AI herkent alle transacties, datums en bedragen met 99.5% nauwkeurigheid.' },
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
        </div>
      </section>

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
              { icon: CheckCircle, title: '99.5% nauwkeurig', desc: 'Onze AI herkent zelfs de meest complexe bankafschriften' },
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
      <section id="pricing" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Kies je abonnement</h2>
            <p className="text-muted-foreground">Altijd zonder verborgen kosten. Opzeggen kan maandelijks.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* TIER 1 - Pay-per-use */}
            <div className="p-6 rounded-2xl border bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">Pay-per-use</h3>
              <div className="mb-3">
                <span className="text-3xl font-bold text-foreground">€2</span>
                <span className="text-muted-foreground text-sm"> per afschrift</span>
              </div>
              <p className="text-sm text-muted-foreground mb-5">Voor zzp'ers met weinig transacties</p>
              
              <ul className="space-y-3 mb-6">
                {['Tot 5 afschriften/maand', 'Excel/CSV/MT940 export', '1 uur levertijd'].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-[#00b8d9] shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 rounded-lg font-semibold border border-cyan-500/30 text-[#00b8d9] hover:bg-cyan-500/10">
                Start gratis trial
              </button>
            </div>

            {/* TIER 2 - Starter (Meest gekozen) */}
            <div className="p-6 rounded-2xl border bg-cyan-500/10 border-[#00b8d9] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#00b8d9] text-[#080d14] text-xs font-semibold rounded-full">Meest gekozen</div>
              
              {/* Kortingsbadge */}
              <div className="mb-2">
                <span className="inline-block px-3 py-1 text-[11px] font-bold text-white rounded-full" style={{ background: 'linear-gradient(135deg, #ff4444, #ff6b35)' }}>
                  36% korting - Beperkte tijd
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">Starter</h3>
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-base text-muted-foreground line-through">€23,50</span>
                <span className="text-3xl font-bold text-foreground">€15</span>
                <span className="text-muted-foreground text-sm">/maand</span>
              </div>
              <p className="text-sm text-muted-foreground mb-5">Voor startende ondernemers</p>
              
              <ul className="space-y-3 mb-6">
                {['50 afschriften/maand', 'Excel/CSV/MT940/CAMT.053', 'BTW categorisering', 'Prioriteit verwerking'].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-[#00b8d9] shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 rounded-lg font-semibold bg-[#00b8d9] text-[#080d14]">
                Start 14-daagse trial
              </button>
            </div>

            {/* TIER 3 - Professional */}
            <div className="p-6 rounded-2xl border bg-card border-border">
              {/* Kortingsbadge */}
              <div className="mb-2">
                <span className="inline-block px-3 py-1 text-[11px] font-bold text-white rounded-full" style={{ background: 'linear-gradient(135deg, #ff4444, #ff6b35)' }}>
                  25% korting - Beperkte tijd
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">Professional</h3>
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-base text-muted-foreground line-through">€40</span>
                <span className="text-3xl font-bold text-foreground">€30</span>
                <span className="text-muted-foreground text-sm">/maand</span>
              </div>
              <p className="text-sm text-muted-foreground mb-5">Voor drukke boekhouders</p>
              
              <ul className="space-y-3 mb-6">
                {['Onbeperkt afschriften', 'Directe verwerking', 'CAMT.053 + MT940', 'Prioriteit support', 'Bulk upload (10 tegelijk)'].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-[#00b8d9] shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 rounded-lg font-semibold border border-cyan-500/30 text-[#00b8d9] hover:bg-cyan-500/10">
                Start 14-daagse trial
              </button>
            </div>

            {/* TIER 4 - Office (Binnenkort beschikbaar) */}
            <div className="p-6 rounded-2xl border bg-card border-border opacity-60 pointer-events-none relative">
              {/* Binnenkort banner */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-500 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                🔜 Binnenkort beschikbaar
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2 mt-2">Office</h3>
              <div className="mb-3">
                <span className="text-3xl font-bold text-muted-foreground">€99</span>
                <span className="text-muted-foreground text-sm">/maand</span>
              </div>
              <p className="text-sm text-muted-foreground mb-5">Voor kantoren met meerdere gebruikers</p>
              
              <ul className="space-y-3 mb-6">
                {['Alles van Professional', 'Tot 5 gebruikers', 'Gedeelde team-omgeving', 'API toegang', 'Custom integraties', 'Accountmanager'].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a 
                href="mailto:info@bscpro.nl?subject=Interesse%20in%20Office%20plan"
                className="block w-full py-3 rounded-lg font-semibold text-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              >
                Notificeer mij
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Wat zeggen onze gebruikers?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Pieter van Dijk', role: 'ZZP\'er, Amsterdam', text: '"Van 3 uur naar 5 minuten werk per maand. Dit is de beste investering voor mijn bedrijf dit jaar."', rating: 5 },
              { name: 'Marieke Jansen', role: 'Boekhouder, Rotterdam', text: '"De MT940 export werkt perfect met Twinfield. Mijn klanten zijn verbaasd hoe snel ik nu hun boekhouding af heb."', rating: 5 },
              { name: 'Thomas Bakker', role: 'Eigenaar, Bakker Accountants', text: '"We draaien nu 40+ afschriften per dag door BSC Pro. Geen enkel ander tool komt in de buurt qua snelheid en nauwkeurigheid."', rating: 5 },
            ].map((testimonial) => (
              <div key={testimonial.name} className="p-6 rounded-xl bg-card border border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#00b8d9] fill-[#00b8d9]" />
                  ))}
                </div>
                <p className="text-foreground text-sm mb-4 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-[#00b8d9] font-semibold text-sm">{testimonial.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
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
              { q: 'Kan ik meerdere afschriften tegelijk uploaden?', a: 'Ja! Met het Professional abonnement kun je tot 10 afschriften tegelijk uploaden. Ze worden parallel verwerkt.' },
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
                <li><Link href="/snelstart/rabobank-pdf-importeren" className="hover:text-[#00b8d9]">Rabobank → SnelStart</Link></li>
                <li><Link href="/exact-online/ing-prive-importeren" className="hover:text-[#00b8d9]">ING → Exact Online</Link></li>
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
                <li><Link href="/privacy" className="hover:text-[#00b8d9]">Privacybeleid</Link></li>
                <li><Link href="/voorwaarden" className="hover:text-[#00b8d9]">Algemene voorwaarden</Link></li>
                <li><Link href="/gdpr" className="hover:text-[#00b8d9]">GDPR / AVG</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">© 2026 BSC Pro. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
