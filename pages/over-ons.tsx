import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { FileText, Zap, Shield, Clock, CheckCircle, ArrowRight, Building2, Users, Globe } from 'lucide-react';

export default function OverOnsPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <Head>
        <title>Over Ons | BSC Pro - De onmisbare schakel in jouw boekhouding</title>
        <meta name="description" content="BSC Pro transformeert PDF-bankafschriften in foutloze, direct importeerbare data voor Exact, SnelStart, Moneybird en meer." />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>
              BSC Pro: <span className="text-[#00b8d9]">De onmisbare schakel</span> in jouw boekhouding
            </h1>
          </div>
        </div>
      </section>

      {/* Introductie */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-6">
              <strong>Automatisering is prachtig, totdat het stopt.</strong>
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Bankkoppelingen werken fantastisch voor standaard zakelijke rekeningen, maar zodra je te maken krijgt met privérekeningen, buitenlandse banken, creditcards of afschriften uit het verleden, val je terug op handmatig overtypen. BSC Pro dicht dit gat.
            </p>
          </div>
        </div>
      </section>

      {/* Wat wij doen */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Wat wij doen</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Wij transformeren onleesbare PDF-bankafschriften in foutloze, direct importeerbare data. Geen complexe software, geen handmatig knip- en plakwerk.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Slimme Conversie */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-[#00b8d9]/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-[#00b8d9]" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Slimme Conversie</h3>
              <p className="text-muted-foreground leading-relaxed">
                Wij zetten PDF-afschriften van vrijwel elke bank feilloos om naar Excel, CSV, MT940 of het nieuwe <strong className="text-foreground">CAMT.053</strong> formaat.
              </p>
            </div>

            {/* Boekhoud-Ready */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-[#00b8d9]/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-[#00b8d9]" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Boekhoud-Ready</h3>
              <p className="text-muted-foreground leading-relaxed">
                Onze output is direct geoptimaliseerd voor naadloze import in pakketten zoals <strong className="text-foreground">Exact Online</strong>, <strong className="text-foreground">SnelStart</strong>, <strong className="text-foreground">Moneybird</strong> en <strong className="text-foreground">e-Boekhouden.nl</strong>.
              </p>
            </div>

            {/* Bulkverwerking */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-[#00b8d9]/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#00b8d9]" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Bulkverwerking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Speciaal voor accountantskantoren bieden wij de mogelijkheid om <strong className="text-foreground">grote volumes</strong> afschriften razendsnel en veilig te verwerken.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waarom BSC Pro */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Waarom BSC Pro?</h2>
              <div className="space-y-6">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  De financiële wereld verandert snel. Bestandsformaten zoals MT940 verdwijnen en de druk rondom BTW-deadlines neemt toe.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Wij zorgen ervoor dat jij en je cliënten <strong className="text-foreground">nooit meer vastlopen</strong> op ontbrekende data of verouderde formaten.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#00b8d9]" />
                    <span className="text-foreground">Tijdsbesparing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#00b8d9]" />
                    <span className="text-foreground">Hoge nauwkeurigheid*</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#00b8d9]" />
                    <span className="text-foreground">Alle formaten</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#00b8d9]" />
                    <span className="text-foreground">Internationale banken</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8">
              <blockquote className="text-xl text-foreground italic leading-relaxed mb-6">
                "Met BSC Pro bespaar je uren frustratie en voorkom je kostbare invoerfouten."
              </blockquote>
              <p className="text-muted-foreground">
                Wij zijn de brug waar de standaard bankkoppeling ophoudt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Formats & Banks */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ondersteunde formaten & banken</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Formaten */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00b8d9]" />
                Export formaten
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Excel (.xlsx)', 'CSV', 'MT940', 'CAMT.053', 'JSON'].map((format) => (
                  <span key={format} className="px-3 py-1 bg-cyan-500/10 text-[#00b8d9] rounded-full text-sm font-medium">
                    {format}
                  </span>
                ))}
              </div>
            </div>

            {/* Banken */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#00b8d9]" />
                Nederlandse banken
              </h3>
              <div className="flex flex-wrap gap-2">
                {['ING', 'Rabobank', 'ABN AMRO', 'SNS', 'Bunq', 'Triodos', 'Knab', 'RegioBank'].map((bank) => (
                  <span key={bank} className="px-3 py-1 bg-secondary text-muted-foreground rounded-full text-sm">
                    {bank}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Ook ondersteuning voor buitenlandse banken en cryptoplatformen</p>
            <div className="flex flex-wrap justify-center gap-2">
                {['Revolut', 'Wise', 'PayPal', 'Binance', 'Coinbase', 'Deutsche Bank', 'BNP Paribas'].map((bank) => (
                  <span key={bank} className="px-3 py-1 bg-secondary text-muted-foreground rounded-full text-sm">
                    {bank}
                  </span>
                ))}
              </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Klaar om het gat te dichten?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start vandaag met BSC Pro en ervaar hoe eenvoudig bankafschriften converteren kan zijn. 
            Geen creditcard nodig.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="px-8 py-4 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold text-lg hover:shadow-[0_0_30px_rgba(0,184,217,0.4)] flex items-center justify-center gap-2">
                Koop losse scan
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/#pricing">
              <button className="px-8 py-4 border border-cyan-500/30 text-[#00b8d9] rounded-lg font-semibold text-lg hover:bg-cyan-500/10">
                Bekijk prijzen
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
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
