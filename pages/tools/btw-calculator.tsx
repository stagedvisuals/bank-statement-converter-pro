import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Calculator, ArrowRight, FileText, Mail, Download, Sparkles, CheckCircle } from 'lucide-react';

export default function BtwCalculator() {
  const [bedragExcl, setBedragExcl] = useState<string>('');
  const [btwPercentage, setBtwPercentage] = useState<number>(21);
  const [result, setResult] = useState<{ excl: number; btw: number; incl: number } | null>(null);
  const [email, setEmail] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  useEffect(() => {
    const bedrag = parseFloat(bedragExcl.replace(',', '.'));
    if (!isNaN(bedrag) && bedrag > 0) {
      const btw = bedrag * (btwPercentage / 100);
      setResult({
        excl: bedrag,
        btw: btw,
        incl: bedrag + btw
      });
    } else {
      setResult(null);
    }
  }, [bedragExcl, btwPercentage]);

  const handlePdfDownload = () => {
    if (!email || !result) return;
    // Hier zou normaal de PDF generation komen
    alert(`Berekening verstuurd naar ${email}!`);
    setShowEmailCapture(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080d14' }}>
      <Head>
        <title>BTW Berekenen 2026 voor ZZP | Gratis Online Calculator | BSC Pro</title>
        <meta name="description" content="Bereken eenvoudig BTW voor je ZZP bedrijf in 2026. 21%, 9% of 0% tarief. Direct je factuur converteren naar Excel? Gebruik onze AI tool." />
        <meta name="keywords" content="BTW berekenen 2026, ZZP BTW calculator, 21 procent BTW, 9 procent BTW, factuur BTW, omzetbelasting ZZP" />
      </Head>

      {/* Navigation */}
      <nav style={{ background: 'rgba(8, 13, 20, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0, 184, 217, 0.15)', padding: '0 24px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <Link href="/"><img src="/logo.svg" alt="BSC Pro" style={{ height: '40px' }} /></Link>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/dashboard" style={{ padding: '8px 16px', color: '#6b7fa3', textDecoration: 'none', fontSize: '14px' }}>Dashboard</Link>
          <Link href="/tools/btw-calculator" style={{ padding: '8px 16px', color: '#00b8d9', background: 'rgba(0, 184, 217, 0.15)', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Tools</Link>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 48px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
            BTW <span style={{ color: '#00b8d9' }}>Berekenen 2026</span>
          </h1>
          <p style={{ color: '#6b7fa3', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Bereken snel en eenvoudig BTW voor je ZZP of MKB bedrijf. 
            Kies het juiste percentage en zie direct het resultaat.
          </p>
        </div>

        {/* Calculator Card */}
        <div style={{ background: 'rgba(10, 18, 32, 0.8)', border: '1px solid rgba(0, 184, 217, 0.15)', borderRadius: '16px', padding: '40px', maxWidth: '600px', margin: '0 auto 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <Calculator style={{ width: '32px', height: '32px', color: '#00b8d9' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#e8edf5' }}>Smart BTW Calculator</h2>
          </div>

          {/* Input Section */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#6b7fa3', fontSize: '14px', marginBottom: '8px' }}>Bedrag exclusief BTW (€)</label>
            <input
              type="text"
              value={bedragExcl}
              onChange={(e) => setBedragExcl(e.target.value)}
              placeholder="bijv. 1000,00"
              style={{ width: '100%', padding: '16px', background: 'rgba(10, 18, 32, 0.6)', border: '1px solid rgba(0, 184, 217, 0.3)', borderRadius: '8px', color: '#e8edf5', fontSize: '18px', fontWeight: 600 }}
            />
          </div>

          {/* BTW Percentage Selection */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', color: '#6b7fa3', fontSize: '14px', marginBottom: '12px' }}>BTW percentage</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[21, 9, 0].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setBtwPercentage(pct)}
                  style={{
                    padding: '16px',
                    background: btwPercentage === pct ? 'rgba(0, 184, 217, 0.2)' : 'rgba(10, 18, 32, 0.6)',
                    border: btwPercentage === pct ? '2px solid #00b8d9' : '1px solid rgba(0, 184, 217, 0.2)',
                    borderRadius: '8px',
                    color: '#e8edf5',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Result Section */}
          {result && (
            <div style={{ background: 'rgba(0, 184, 217, 0.1)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6b7fa3' }}>Exclusief BTW:</span>
                <span style={{ color: '#e8edf5', fontWeight: 600 }}>€{result.excl.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6b7fa3' }}>BTW ({btwPercentage}%):</span>
                <span style={{ color: '#00b8d9', fontWeight: 600 }}>€{result.btw.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(0, 184, 217, 0.2)' }}>
                <span style={{ color: '#e8edf5', fontWeight: 600 }}>Totaal inclusief BTW:</span>
                <span style={{ color: '#00b8d9', fontWeight: 700, fontSize: '20px' }}>€{result.incl.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* PDF Download Button */}
          {result && !showEmailCapture && (
            <button
              onClick={() => setShowEmailCapture(true)}
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(0, 184, 217, 0.1)',
                border: '1px solid rgba(0, 184, 217, 0.3)',
                borderRadius: '8px',
                color: '#00b8d9',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Mail style={{ width: '18px', height: '18px' }} />
              Berekening naar PDF sturen
            </button>
          )}

          {/* Email Capture */}
          {showEmailCapture && (
            <div style={{ marginTop: '16px' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Jouw e-mailadres"
                style={{ width: '100%', padding: '12px', background: 'rgba(10, 18, 32, 0.6)', border: '1px solid rgba(0, 184, 217, 0.3)', borderRadius: '8px', color: '#e8edf5', marginBottom: '12px' }}
              />
              <button
                onClick={handlePdfDownload}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#00b8d9',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#080d14',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Download style={{ width: '18px', height: '18px' }} />
                Verstuur PDF
              </button>
            </div>
          )}
        </div>

        {/* Upsell Card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0, 184, 217, 0.1) 0%, rgba(0, 184, 217, 0.05) 100%)', border: '1px solid rgba(0, 184, 217, 0.3)', borderRadius: '16px', padding: '32px', maxWidth: '600px', margin: '0 auto 48px', textAlign: 'center' }}>
          <Sparkles style={{ width: '40px', height: '40px', color: '#00b8d9', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#e8edf5', marginBottom: '12px' }}>Factuur ontvangen?</h3>
          <p style={{ color: '#6b7fa3', marginBottom: '24px', lineHeight: '1.6' }}>
            Scan je factuur direct met onze AI Vision technologie. 
            Wij extraheren automatisch alle BTW-gegevens en converteren naar Excel.
          </p>
          <Link href="/dashboard">
            <button style={{ padding: '16px 32px', background: '#00b8d9', border: 'none', borderRadius: '8px', color: '#080d14', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Probeer AI Scanner
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>
          </Link>
        </div>

        {/* SEO Content Section */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 0' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', marginBottom: '24px' }}>
            BTW Berekenen 2026 voor ZZP: Alles Wat Je Moet Weten
          </h2>
          
          <div style={{ color: '#e8edf5', lineHeight: '1.8', fontSize: '16px' }}>
            <p style={{ marginBottom: '20px' }}>
              Als ZZP'er in Nederland moet je jaarlijks omzetbelasting (BTW) afdragen aan de Belastingdienst. 
              Het correct berekenen van BTW is essentieel voor je boekhouding en belastingaangifte. In 2026 
              blijven de BTW-tarieven gelijk aan voorgaande jaren: het <strong>hoogtarief van 21%</strong> voor 
              de meeste goederen en diensten, het <strong>laag tarief van 9%</strong> voor specifieke producten 
              zoals voedsel en boeken, en het <strong>nultarief van 0%</strong> voor bepaalde internationale transacties.
            </p>

            <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#00b8d9', margin: '32px 0 16px' }}>Hoe werkt BTW berekenen als ZZP?</h3>
            <p style={{ marginBottom: '20px' }}>
              Bij het berekenen van BTW voor je ZZP-onderneming moet je rekening houden met verschillende factoren. 
              Allereerst bepaal je het <strong>exclusieve bedrag</strong> - dit is het bedrag zonder BTW. Vervolgens 
              kies je het juiste BTW-percentage afhankelijk van je dienst of product. Voor de meeste ZZP'ers 
              geldt het standaardtarief van 21%. Met onze gratis online BTW calculator bereken je binnen 
              seconden zowel het BTW-bedrag als het totaalbedrag inclusief BTW.
            </p>

            <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#00b8d9', margin: '32px 0 16px' }}>Welk BTW percentage geldt voor jou?</h3>
            <ul style={{ marginBottom: '20px', paddingLeft: '24px' }}>
              <li style={{ marginBottom: '12px' }}><strong>21% BTW:</strong> Standaardtarief voor de meeste diensten en producten. Denk aan consultancy, IT-diensten, advieswerk en fysieke producten.</li>
              <li style={{ marginBottom: '12px' }}><strong>9% BTW:</strong> Laag tarief voor voedingsmiddelen, boeken, tijdschriften, kunst en bepaalde arbeidsintensieve diensten.</li>
              <li style={{ marginBottom: '12px' }}><strong>0% BTW:</strong> Nultarief voor internationale handel en specifieke exempte goederen.</li>
            </ul>

            <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#00b8d9', margin: '32px 0 16px' }}>BTW aangifte 2026: Belangrijke deadlines</h3>
            <p style={{ marginBottom: '20px' }}>
              Als ZZP'er dien je periodiek BTW-aangifte te doen. Dit kan per maand, per kwartaal of per jaar, 
              afhankelijk van de omvang van je onderneming. De meeste ZZP'ers doen <strong>kwartaalaangifte</strong>. 
              De deadlines voor 2026 zijn: 31 januari (Q4 2025), 30 april (Q1), 31 juli (Q2) en 31 oktober (Q3). 
              Het is cruciaal om je BTW-gegevens nauwkeurig bij te houden om boetes te voorkomen.
            </p>

            <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#00b8d9', margin: '32px 0 16px' }}>Automatiseer je BTW-berekeningen met BSC Pro</h3>
            <p style={{ marginBottom: '20px' }}>
              Handmatig BTW berekenen is tijdrovend en foutgevoelig. Met <strong>BSC Pro</strong> automatiseer 
              je dit proces volledig. Onze AI-gestuurde tool scant je PDF-facturen en bankafschriften, 
              extraheert automatisch de BTW-bedragen en categoriseert transacties volgens de Belastingdienst-rubrieken 
              (1a voor 21%, 1b voor 9%, 1d voor 0%). Je krijgt direct een overzicht dat je kunt gebruiken 
              voor je BTW-aangifte. Dit bespaart uren werk en minimaliseert fouten.
            </p>

            <div style={{ background: 'rgba(0, 184, 217, 0.1)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '12px', padding: '24px', marginTop: '32px' }}>
              <h4 style={{ fontSize: '20px', fontWeight: 600, color: '#e8edf5', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle style={{ width: '24px', height: '24px', color: '#00b8d9' }} />
                Waarom kiezen voor BSC Pro?
              </h4>
              <ul style={{ color: '#6b7fa3', lineHeight: '1.8' }}>
                <li>✓ 99.5% nauwkeurige BTW-extractie uit PDF-facturen</li>
                <li>✓ Directe export naar Excel, CSV en MT940</li>
                <li>✓ Automatische categorisering volgens Belastingdienst-rubrieken</li>
                <li>✓ AVG-proof: data wordt na 24 uur verwijderd</li>
                <li>✓ Gratis voor je eerste 2 conversies</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: 'rgba(10, 18, 32, 0.8)', borderTop: '1px solid rgba(0, 184, 217, 0.1)', padding: '32px', textAlign: 'center' }}>
        <p style={{ color: '#6b7fa3', fontSize: '14px' }}>
          © 2026 BSC Pro | <Link href="/privacy" style={{ color: '#00b8d9', textDecoration: 'none' }}>Privacy</Link> | <Link href="/voorwaarden" style={{ color: '#00b8d9', textDecoration: 'none' }}>Voorwaarden</Link>
        </p>
      </footer>
    </div>
  );
}
