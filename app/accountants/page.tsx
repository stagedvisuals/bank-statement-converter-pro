import Link from 'next/link';
import { 
  FileText, 
  Upload, 
  FileSpreadsheet, 
  Shield, 
  Clock, 
  CheckCircle,
  Building2,
  Users,
  ArrowRight,
  Lock,
  Landmark,
  Euro,
  Check,
  Star
} from 'lucide-react';

export const metadata = {
  title: "BSC Pro voor Accountants | Whitelabel Bank Statement Converter",
  description: "Bied je klanten een professionele bank statement converter onder je eigen merk. Whitelabel oplossing voor accountants en boekhouders.",
};

export default function AccountantsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav style={{ background: '#0A1628', padding: '0 16px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0, 212, 255, 0.1)' }}>
        <Link href="/">
          <img src="/logo-transparent.svg" alt="BSC Pro" style={{ display: 'block', height: '44px', width: 'auto' }} />
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#voordelen" style={{ color: '#94A3B8', fontSize: '14px', textDecoration: 'none' }} className="hover:text-white">Voordelen</a>
          <a href="#prijzen" style={{ color: '#94A3B8', fontSize: '14px', textDecoration: 'none' }} className="hover:text-white">Prijzen</a>
          <Link href="/" style={{ color: '#94A3B8', fontSize: '14px', textDecoration: 'none' }} className="hover:text-white">Consumenten website</Link>
        </div>
        
        <Link href="/contact">
          <button style={{ 
            background: '#0066CC', 
            color: '#FFFFFF', 
            fontWeight: 700, 
            borderRadius: '8px', 
            padding: '10px 16px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px'
          }}>
            Contact opnemen
          </button>
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ background: '#0A1628', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(0, 212, 255, 0.1)', 
              border: '1px solid rgba(0, 212, 255, 0.3)', 
              borderRadius: '999px', 
              padding: '6px 16px',
              marginBottom: '24px'
            }}>
              <Building2 style={{ width: '16px', height: '16px', color: '#00D4FF' }} />
              <span style={{ fontSize: '13px', color: '#00D4FF', fontWeight: 500 }}>Exclusief voor accountants</span>
            </div>

            <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#FFFFFF', marginBottom: '20px', lineHeight: 1.2 }}>
              Bank Statement Converter<br />
              <span style={{ color: '#00D4FF' }}>onder je eigen merk</span>
            </h1>
            
            <p style={{ fontSize: '18px', color: '#94A3B8', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
              Bied je klanten een professionele tool om bankafschriften te converteren. 
              Whitelabel oplossing met jouw logo en huisstijl.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <button style={{
                  background: '#00D4FF',
                  color: '#0A1628',
                  fontWeight: 700,
                  borderRadius: '8px',
                  padding: '14px 28px',
                  fontSize: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  Demo aanvragen
                  <ArrowRight style={{ width: '18px', height: '18px' }} />
                </button>
              </Link>
              <span style={{ color: '#64748B', fontSize: '14px' }}>Gratis onboarding inclusief</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#0D2144', padding: '40px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#00D4FF' }}>100+</div>
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>Actieve accountants</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#00D4FF' }}>50K+</div>
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>Conversies per maand</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#00D4FF' }}>99.5%</div>
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>Nauwkeurigheid</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#00D4FF' }}>&lt;3s</div>
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>Per conversie</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="voordelen" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0A1628', marginBottom: '12px' }}>
              Waarom kiezen voor whitelabel?
            </h2>
            <p style={{ color: '#64748B', fontSize: '16px' }}>Professionele uitstraling, minder werk</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div style={{ padding: '32px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 212, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Shield style={{ width: '24px', height: '24px', color: '#00D4FF' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0A1628', marginBottom: '8px' }}>Jouw branding</h3>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Logo, kleuren, domeinnaam. De tool ziet eruit als onderdeel van jouw kantoor.</p>
            </div>

            <div style={{ padding: '32px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 212, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Clock style={{ width: '24px', height: '24px', color: '#00D4FF' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0A1628', marginBottom: '8px' }}>Bespaar tijd</h3>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Klanten converteren zelf hun bankafschriften. Jij ontvangt gestructureerde bestanden.</p>
            </div>

            <div style={{ padding: '32px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 212, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Euro style={{ width: '24px', height: '24px', color: '#00D4FF' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0A1628', marginBottom: '8px' }}>Extra inkomsten</h3>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Bied de tool als service aan klanten. Jij bepaalt de prijs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: '#0A1628', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
              Hoe werkt het?
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '16px' }}>Eenvoudig geïntegreerd in je workflow</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#00D4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ color: '#0A1628', fontWeight: 700, fontSize: '20px' }}>1</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>Klant uploadt PDF</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px' }}>Via jouw branded portaal</p>
            </div>

            <div className="text-center">
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#00D4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ color: '#0A1628', fontWeight: 700, fontSize: '20px' }}>2</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>AI converteert</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px' }}>In seconden naar Excel/CSV/MT940</p>
            </div>

            <div className="text-center">
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#00D4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ color: '#0A1628', fontWeight: 700, fontSize: '20px' }}>3</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>Bestand wordt gedeeld</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px' }}>Automatisch met jouw kantoor</p>
            </div>

            <div className="text-center">
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#00D4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ color: '#0A1628', fontWeight: 700, fontSize: '20px' }}>4</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>Direct boeken</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px' }}>Met categorisering en BTW</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0A1628', marginBottom: '24px' }}>
                Alles wat je nodig hebt
              </h2>
              <div className="space-y-4">
                {[
                  'Alle Nederlandse banken ondersteund',
                  'Automatische categorisering',
                  'BTW-overzicht per transactie',
                  'MT940 export voor Exact/Twinfield',
                  'Beveiligde cloud-opslag',
                  'Audit trail voor compliance',
                  'API voor koppeling met je software',
                  'Onbeperkt aantal gebruikers'
                ].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle style={{ width: '20px', height: '20px', color: '#00D4FF', flexShrink: 0 }} />
                    <span style={{ color: '#334155', fontSize: '15px' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#0A1628', borderRadius: '16px', padding: '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', fontWeight: 800, color: '#00D4FF' }}>€149</div>
                <div style={{ color: '#94A3B8', fontSize: '14px' }}>per maand</div>
              </div>
              <div>
                {[
                  'Whitelabel portal met jouw branding',
                  'Onbeperkt aantal klanten',
                  'Prioriteit support',
                  'Gratis updates',
                  'Geen opstartkosten'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Check style={{ width: '16px', height: '16px', color: '#00D4FF' }} />
                    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" style={{ display: 'block', marginTop: '24px' }}>
                <button style={{
                  width: '100%',
                  background: '#00D4FF',
                  color: '#0A1628',
                  fontWeight: 700,
                  borderRadius: '8px',
                  padding: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}>
                  Start gratis proefperiode
                </button>
              </Link>
              <p style={{ color: '#64748B', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>14 dagen gratis uitproberen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
            {[1,2,3,4,5].map((i) => (
              <Star key={i} style={{ width: '24px', height: '24px', color: '#FACC15', fill: '#FACC15' }} />
            ))}
          </div>
          <blockquote style={{ fontSize: '24px', color: '#0A1628', fontStyle: 'italic', marginBottom: '24px' }}>
            "Sinds we BSC Pro whitelabel aanbieden, converteren onze klanten zelf hun bankafschriften. 
            Dit bespaart ons uren werk per week."
          </blockquote>
          <div>
            <div style={{ fontWeight: 600, color: '#0A1628' }}>Marjan de Vries</div>
            <div style={{ color: '#64748B', fontSize: '14px' }}>Eigenaar, De Vries Administratie</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0A1628', padding: '80px 0' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>
            Klaar om te starten?
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '18px', marginBottom: '32px' }}>
            Plan een gratis demo en zie hoe het werkt onder jouw merk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <button style={{
                background: '#00D4FF',
                color: '#0A1628',
                fontWeight: 700,
                borderRadius: '8px',
                padding: '16px 32px',
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer'
              }}>
                Demo aanvragen
              </button>
            </Link>
            <Link href="/">
              <button style={{
                background: 'transparent',
                color: '#FFFFFF',
                fontWeight: 600,
                borderRadius: '8px',
                padding: '16px 32px',
                fontSize: '16px',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer'
              }}>
                Consumenten website bekijken
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#050D18', padding: '40px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo-transparent.svg" alt="BSC Pro" style={{ height: '32px' }} />
            </Link>
            
            <div className="flex gap-6 text-sm" style={{ color: '#64748B' }}>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/voorwaarden" className="hover:text-white transition-colors">Voorwaarden</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: '#475569' }}>
              <p>© 2026 BSC Pro. Alle rechten voorbehouden.</p>
              <p>Data opgeslagen in Nederland 🇳🇱</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
