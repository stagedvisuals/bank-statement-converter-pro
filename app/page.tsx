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
    <div className="min-h-screen" style={{ background: '#080d14' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '80px', background: '#080d14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Bar */}
            <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px', overflowX: 'auto' }}>
              <div style={{ background: 'rgba(0, 184, 217, 0.1)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '999px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-3 h-3" style={{ color: '#00b8d9', fill: '#00b8d9' }} />
                  ))}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap' }}>4.9/5</span>
              </div>
              <div style={{ background: 'rgba(0, 184, 217, 0.1)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '999px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <Users className="w-3 h-3" style={{ color: '#00b8d9' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap' }}>100+ boekhouders</span>
              </div>
              <div style={{ background: 'rgba(0, 184, 217, 0.1)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '999px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <Database className="w-3 h-3" style={{ color: '#00b8d9' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap' }}>MT940</span>
              </div>
              <div style={{ background: 'rgba(0, 184, 217, 0.1)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '999px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <span style={{ fontSize: '12px' }}>🇳🇱</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap' }}>#1 in NL</span>
              </div>
            </div>

            <h1 style={{
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '24px',
              lineHeight: 1.1,
              fontFamily: 'var(--font-syne), Syne, sans-serif',
              wordBreak: 'break-word',
              hyphens: 'auto',
              maxWidth: '100%',
              fontSize: 'clamp(32px, 8vw, 64px)'
            }} className="md:text-[clamp(40px,6vw,60px)] lg:text-[clamp(48px,5vw,72px)]">
              Converteer bank&shy;afschriften <span style={{ color: '#00b8d9' }}>in seconden</span>
            </h1>
            
            <p style={{ fontSize: '18px', color: '#6b7fa3', marginBottom: '32px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              Zet PDF bankafschriften automatisch om naar Excel, CSV én MT940. 
              99.5% nauwkeurig. Geen handmatige invoer meer.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <Link href="/register">
                <button style={{
                  background: '#00b8d9',
                  color: '#080d14',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(0, 184, 217, 0.3)'
                }}>
                  <Upload className="w-5 h-5" />
                  Probeer het gratis
                </button>
              </Link>
              <span style={{ fontSize: '14px', color: '#6b7fa3' }}>Je eerste 2 conversies zijn van ons</span>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px', fontSize: '12px', color: '#6b7fa3' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock className="w-4 h-4" style={{ color: '#00b8d9' }} />
                <span>AVG-proof</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle className="w-4 h-4" style={{ color: '#00b8d9' }} />
                <span>99.5% nauwkeurig</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock className="w-4 h-4" style={{ color: '#00b8d9' }} />
                <span>24/7 beschikbaar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Bar */}
      <section style={{ padding: '24px 0', background: '#0a1220', borderTop: '1px solid rgba(0, 184, 217, 0.1)', borderBottom: '1px solid rgba(0, 184, 217, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs mb-4" style={{ color: '#6b7fa3' }}>Vertrouwd door boekhouders uit heel Nederland</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-60">
            {['ING', 'Rabobank', 'ABN AMRO', 'SNS', 'Bunq', 'Triodos'].map((bank) => (
              <span key={bank} className="text-lg font-bold" style={{ color: '#6b7fa3' }}>{bank}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: '#080d14', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>Hoe werkt het?</h2>
            <p style={{ color: '#6b7fa3', fontSize: '16px' }}>Van PDF naar Excel in minder dan een minuut</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Upload, title: 'Upload je PDF', desc: 'Sleep je PDF bankafschrift naar onze tool. Alle Nederlandse banken ondersteund.' },
              { icon: Zap, title: 'AI verwerkt automatisch', desc: 'Onze AI herkent alle transacties, datums en bedragen met 99.5% nauwkeurigheid.' },
              { icon: FileSpreadsheet, title: 'Download Excel/CSV/MT940', desc: 'Met automatische categorisering, BTW-overzicht en MT940 export.' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div style={{ 
                  width: '64px', height: '64px', borderRadius: '16px', 
                  background: 'rgba(0, 184, 217, 0.1)', border: '2px solid #00b8d9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' 
                }}>
                  <step.icon style={{ width: '28px', height: '28px', color: '#00b8d9' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ color: '#6b7fa3', fontSize: '14px' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '80px 0', background: '#080d14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>
              Waarom kiezen voor BSC<span style={{ color: '#00b8d9' }}>PRO</span>?
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
              <div key={feature.title} style={{
                padding: '24px', borderRadius: '12px',
                background: 'rgba(10, 18, 32, 0.8)',
                border: feature.highlight ? '1px solid rgba(0, 184, 217, 0.3)' : '1px solid rgba(0, 184, 217, 0.12)',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '8px',
                  background: feature.highlight ? 'rgba(0, 184, 217, 0.15)' : 'rgba(0, 184, 217, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
                }}>
                  <feature.icon style={{ width: '20px', height: '20px', color: '#00b8d9' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>{feature.title}</h3>
                <p style={{ fontSize: '14px', color: '#6b7fa3' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="calculator" style={{ padding: '80px 0', background: '#080d14' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>Bereken je maandelijkse besparing</h2>
            <p style={{ color: '#6b7fa3' }}>Zie direct hoeveel tijd en geld je wint</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 items-center">
            <div className="lg:col-span-3" style={{
              background: 'rgba(10, 18, 32, 0.8)', border: '1px solid rgba(0, 184, 217, 0.15)', borderRadius: '16px', padding: '32px'
            }}>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#e8edf5' }}>Aantal bankafschriften per maand</label>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: '#00b8d9' }}>{statements}</span>
                </div>
                <input type="range" min="5" max="200" value={statements} onChange={(e) => setStatements(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#00b8d9' }} />
                <div className="flex justify-between text-xs mt-2" style={{ color: '#6b7fa3' }}>
                  <span>5</span><span>100</span><span>200</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#e8edf5' }}>Uurloon boekhouder</label>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: '#00b8d9' }}>€{hourlyRate}</span>
                </div>
                <input type="range" min="40" max="150" step="5" value={hourlyRate} onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#00b8d9' }} />
                <div className="flex justify-between text-xs mt-2" style={{ color: '#6b7fa3' }}>
                  <span>€40</span><span>€95</span><span>€150</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2" style={{ color: '#ffffff' }}>
              <div className="space-y-4 mb-8">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(10, 18, 32, 0.6)', borderRadius: '12px', border: '1px solid rgba(0, 184, 217, 0.1)' }}>
                  <span style={{ color: '#6b7fa3' }}>Handmatig invoeren</span>
                  <span style={{ fontSize: '24px', fontWeight: 700 }}>{manualHours} uur</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(0, 184, 217, 0.1)', borderRadius: '12px', border: '1px solid rgba(0, 184, 217, 0.3)' }}>
                  <span style={{ color: '#00b8d9' }}>Met BSC Pro</span>
                  <span style={{ fontSize: '24px', fontWeight: 700 }}>{bscProMinutes} min</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(10, 18, 32, 0.8)', borderRadius: '16px', border: '1px solid rgba(0, 184, 217, 0.15)' }}>
                <p style={{ color: '#6b7fa3', marginBottom: '8px' }}>Je bespaart per maand:</p>
                <div style={{ fontSize: '48px', fontWeight: 700 }}>{hoursSaved.toFixed(1)} uur</div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#00b8d9', marginBottom: '16px' }}>= €{moneySaved}</div>
                <Link href="/register">
                  <button style={{ width: '100%', background: '#00b8d9', color: '#080d14', fontWeight: 600, padding: '12px 24px', borderRadius: '6px', border: 'none' }}>
                    Start met besparen
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 0', background: '#0a1220' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Quote className="w-10 h-10 mx-auto mb-4" style={{ color: '#00b8d9' }} />
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>Wat onze klanten zeggen</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: 'Marco van Dijk', role: 'Dijk Administratie', text: 'Wij verwerken wekelijks meer dan 50 bankafschriften. Met BSC Pro besparen we per maand ruim 10 uur werk.', initials: 'MV' },
              { name: 'Sandra Visser', role: 'Boekhouder Rotterdam', text: 'Eindelijk geen handmatig werk meer. Ik verwerk nu 3x zoveel afschriften.', initials: 'SV' },
              { name: 'Kevin de Groot', role: 'ZZP Accountant', text: 'Voor €2 per upload bespaar ik een uur werk. Beste investering van het jaar.', initials: 'KG' },
              { name: 'Lisa Brouwer', role: 'Administrateur', text: 'De MT940 export scheelt me uren per week.', initials: 'LB' },
              { name: 'Jeroen Smit', role: 'Boekhouder Den Haag', text: 'Eindelijk een Nederlandse tool die echt werkt.', initials: 'JS' }
            ].map((t) => (
              <div key={t.name} style={{ background: 'rgba(10, 18, 32, 0.8)', border: '1px solid rgba(0, 184, 217, 0.12)', borderRadius: '12px', padding: '24px' }}>
                <Quote className="w-8 h-8 mb-4" style={{ color: '#00b8d9', opacity: 0.5 }} />
                <blockquote style={{ color: '#e8edf5', fontSize: '14px', marginBottom: '16px' }}>{t.text}</blockquote>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 184, 217, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 184, 217, 0.2)' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#00b8d9' }}>{t.initials}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7fa3' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moneyback Guarantee */}
      <section style={{ padding: '24px 0', background: 'rgba(0, 184, 217, 0.08)', borderTop: '1px solid rgba(0, 184, 217, 0.2)', borderBottom: '1px solid rgba(0, 184, 217, 0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3" style={{ color: '#00b8d9' }}>
            <CheckCircle className="w-6 h-6" />
            <span className="text-lg font-semibold">30 dagen geld-terug-garantie. Geen vragen gesteld.</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 0', background: '#080d14' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>Start vandaag nog met besparen</h2>
          <p style={{ color: '#6b7fa3', marginBottom: '32px' }}>Je eerste 2 PDF uploads zijn gratis — geen creditcard nodig</p>
          <Link href="/register">
            <button style={{ background: '#00b8d9', color: '#080d14', padding: '16px 32px', borderRadius: '6px', fontWeight: 600, fontSize: '16px', border: 'none' }}>
              Claim je 2 gratis conversies
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a1220', padding: '40px 0', borderTop: '1px solid rgba(0, 184, 217, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#00b8d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText style={{ width: '20px', height: '20px', color: '#080d14' }} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>BSC<span style={{ color: '#00b8d9' }}>PRO</span></span>
            </Link>
            
            <div className="flex gap-6" style={{ fontSize: '14px' }}>
              {['Privacy', 'Voorwaarden', 'Contact'].map((link) => (
                <Link key={link} href={`/${link.toLowerCase()}`} style={{ color: '#6b7fa3', textDecoration: 'none' }}>{link}</Link>
              ))}
            </div>
          </div>
          
          <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(0, 184, 217, 0.1)' }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4" style={{ fontSize: '14px', color: '#6b7fa3' }}>
              <p>© 2026 BSC<span style={{ color: '#00b8d9' }}>PRO</span>. Alle rechten voorbehouden.</p>
              <p>Data opgeslagen in Nederland 🇳🇱</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
