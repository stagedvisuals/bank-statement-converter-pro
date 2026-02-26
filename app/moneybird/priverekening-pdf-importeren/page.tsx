import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Upload, FileText, CheckCircle, ArrowRight, AlertTriangle, Shield, Building2 } from 'lucide-react';

export default function MoneybirdPrivePage() {
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>PDF Bankafschrift Importeren in Moneybird | BSCPro</title>
        <meta name="description" content="Moneybird accepteert geen PDF of CSV? Converteer je bankafschrift met BSCPro naar CAMT.053 formaat en importeer direct in Moneybird." />
        <meta name="keywords" content="moneybird pdf inlezen, bankafschrift moneybird, csv moneybird weigert, camt.053 converter" />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
            <span className="text-[#00b8d9] text-sm font-medium">✓ Werkt met alle bank PDF's</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>
            PDF Bankafschriften Importeren in Moneybird? <span className="text-[#00b8d9]">Gebruik CAMT.053</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Moneybird accepteert geen CSV of Excel voor banktransacties. Zet je PDF om naar het officiële CAMT.053 formaat in 2 minuten.
          </p>

          <Link href="/login">
            <button className="px-8 py-4 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold text-lg hover:shadow-[0_0_30px_rgba(0,184,217,0.4)] flex items-center justify-center gap-2 mx-auto">
              PDF naar CAMT.053
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
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Waarom weigert Moneybird mijn PDF en CSV?</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Moneybird accepteert <strong className="text-foreground">geen CSV of Excel</strong> voor banktransacties. Een privérekening of buitenlandse bank levert vaak alleen een PDF-bestand. Dit creëert een probleem: je hebt wel de transactiegegevens, maar Moneybird kan ze niet inlezen.
              </p>
              <p>
                Handmatig invoeren kost uren en verhoogt de kans op fouten aanzienlijk. Voor elke transactie moet je datum, bedrag, omschrijving en tegenrekening overtypen.
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
              BSCPro converteert jouw onleesbare PDF direct naar <span className="text-[#00b8d9]">Moneybird-goedgekeurd CAMT.053</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Het CAMT.053 formaat is de moderne standaard die Moneybird volledig ondersteunt. Wij zetten je PDF om naar dit formaat, zodat je direct kunt importeren.
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
                  'Snel importeren van privérekening afschriften',
                  'Ondersteuning voor buitenlandse banken',
                  'Direct geïmporteerd in Moneybird',
                  'Geen technische kennis nodig'
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
                  'Consistente CAMT.053 output',
                  'Werkt met alle PDF formaten',
                  'Tijdsbesparing bij maandafsluiting'
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
            <p className="text-muted-foreground text-lg">3 simpele stappen naar Moneybird</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border-2 border-[#00b8d9] flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-[#00b8d9]" />
              </div>
              <div className="text-[#00b8d9] font-bold text-sm mb-2">STAP 1</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Upload PDF</h3>
              <p className="text-muted-foreground">
                Sleep je bankafschrift PDF in onze tool. Alle banken ondersteund.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border-2 border-[#00b8d9] flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-[#00b8d9]" />
              </div>
              <div className="text-[#00b8d9] font-bold text-sm mb-2">STAP 2</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Converteer naar CAMT.053</h3>
              <p className="text-muted-foreground">
                Onze AI herkent alle transacties en genereert een Moneybird-compatibel bestand.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border-2 border-[#00b8d9] flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#00b8d9]" />
              </div>
              <div className="text-[#00b8d9] font-bold text-sm mb-2">STAP 3</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Importeer in Moneybird</h3>
              <p className="text-muted-foreground">
                Ga naar Moneybird, importeer het CAMT.053 bestand en je boekhouding is bijgewerkt.
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
            Geen gedoe meer met handmatig invoeren. Zet je PDF direct om naar een Moneybird-ready CAMT.053 bestand.
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
