import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Upload, FileText, CheckCircle, ArrowRight, AlertTriangle, Clock, Shield, Building2 } from 'lucide-react';

export default function INGExactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>ING Privérekening Importeren in Exact Online | BSCPro</title>
        <meta name="description" content="Krijg je ING privérekening PDF niet in Exact Online? Converteer het bankafschrift met BSCPro in 2 minuten naar MT940." />
        <meta name="keywords" content="ing pdf naar exact online, bankafschrift inlezen exact, privérekening exact online, mt940 exact" />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
            <span className="text-[#00b8d9] text-sm font-medium">✓ Werkt met alle ING PDF's</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>
            ING Privérekening Bankafschriften Importeren in <span className="text-[#00b8d9]">Exact Online</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Zet je ING privérekening PDF om naar een Exact Online-compatibel MT940 bestand in slechts 2 minuten.
          </p>

          <Link href="/login">
            <button className="px-8 py-4 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold text-lg hover:shadow-[0_0_30px_rgba(0,184,217,0.4)] flex items-center justify-center gap-2 mx-auto">
              Direct Converten
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">Geen registratie nodig • Eerste 2 conversies gratis</p>
        </div>
      </section>

      {/* Het Probleem */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Waarom werkt mijn ING privérekening niet in Exact Online?</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Exact Online ondersteunt standaard <strong className="text-foreground">geen directe koppeling</strong> of PDF-import voor de ING privérekening. Dit is een veelvoorkomend probleem voor ZZP'ers en accountants die zakelijke transacties via hun privérekening laten lopen.
              </p>
              <p>
                Het handmatig overtypen van elke transactie kost uren en veroorzaakt fouten. Voor accountants die meerdere cliënten met ING privérekeningen beheren, loopt dit snel op tot dagen werk per maand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* De Oplossing */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              BSCPro converteert ING PDF direct naar <span className="text-[#00b8d9]">Exact Online-ready MT940</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Onze slimme conversietool leest je ING PDF uit en genereert een foutloos MT940 bestand dat Exact Online direct accepteert. Geen technische kennis nodig.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#00b8d9]" />
                Voor ZZP'ers
              </h3>
              <ul className="space-y-3">
                {[
                  'Snelle verwerking van privérekening afschriften',
                  'Direct importeerbaar in Exact Online',
                  'Geen technische kennis nodig',
                  'Pay-per-use of maandabonnement'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00b8d9] shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#00b8d9]" />
                Voor Accountants
              </h3>
              <ul className="space-y-3">
                {[
                  'Bulkverwerking van meerdere cliënten',
                  'Consistente MT940 output',
                  'Tijdsbesparing bij BTW-aangiftes',
                  'Ondersteuning voor alle ING PDF typen'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00b8d9] shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Hoe het werkt */}
      <section className="py-20 bg-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Hoe het werkt</h2>
            <p className="text-muted-foreground text-lg">3 simpele stappen naar Exact Online</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border-2 border-[#00b8d9] flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-[#00b8d9]" />
              </div>
              <div className="text-[#00b8d9] font-bold text-sm mb-2">STAP 1</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Upload ING PDF</h3>
              <p className="text-muted-foreground">
                Sleep je ING privérekening PDF in onze tool. Wij ondersteunen alle ING formaten.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border-2 border-[#00b8d9] flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-[#00b8d9]" />
              </div>
              <div className="text-[#00b8d9] font-bold text-sm mb-2">STAP 2</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Converteer naar MT940</h3>
              <p className="text-muted-foreground">
                Onze AI herkent alle transacties en genereert een Exact Online-compatibel MT940 bestand.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border-2 border-[#00b8d9] flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#00b8d9]" />
              </div>
              <div className="text-[#00b8d9] font-bold text-sm mb-2">STAP 3</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Importeer in Exact Online</h3>
              <p className="text-muted-foreground">
                Ga naar Exact Online, importeer het MT940 bestand en je boekhouding is bijgewerkt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Start met converteren
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Geen gedoe meer met handmatig overtypen. Zet je ING privérekening direct om naar een Exact Online-ready bestand.
          </p>
          <Link href="/login">
            <button className="px-8 py-4 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold text-lg hover:shadow-[0_0_30px_rgba(0,184,217,0.4)] flex items-center justify-center gap-2 mx-auto">
              Gratis Proberen
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold">
              BSC<span className="text-[#00b8d9]">PRO</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2026 BSC Pro. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
