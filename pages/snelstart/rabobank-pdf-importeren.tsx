import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Upload, FileText, CheckCircle, ArrowRight, AlertTriangle, Clock, Shield } from 'lucide-react';

export default function RabobankSnelStartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Rabobank PDF Bankafschrift Importeren in SnelStart | BSCPro</title>
        <meta name="description" content="Lukt het niet om een Rabobank PDF in SnelStart te krijgen? Zet hem met BSCPro in 2 minuten om naar een SnelStart-ready CAMT.053 bestand. Probeer het nu." />
        <meta name="keywords" content="rabobank pdf naar snelstart, bankafschrift inlezen snelstart, pdf naar camt.053, mt940 snelstart" />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
            <span className="text-[#00b8d9] text-sm font-medium">✓ Werkt met alle Rabobank PDF's</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>
            Rabobank PDF Bankafschriften Importeren in SnelStart? <span className="text-[#00b8d9]">Zo gepiept.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Zet onleesbare Rabobank PDF's binnen 2 minuten om naar het officiële CAMT.053 formaat voor SnelStart.
          </p>

          <Link href="/login">
            <button className="px-8 py-4 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold text-lg hover:shadow-[0_0_30px_rgba(0,184,217,0.4)] flex items-center justify-center gap-2 mx-auto">
              Start Nu met Converteren
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">Probeer het gratis • Geen registratie nodig</p>
        </div>
      </section>

      {/* Het Probleem */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Waarom pakt SnelStart mijn PDF niet?</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Werk je met een <strong className="text-foreground">privérekening van de Rabobank</strong>, of heb je oude afschriften opgevraagd? Dan krijg je vaak alleen een PDF-bestand.
              </p>
              <p>
                SnelStart kan hier niets mee en eist een digitaal bankformaat. Handmatig overtikken kost uren en veroorzaakt fouten.
              </p>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-foreground">Uren handwerk</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-foreground">Typefouten</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                <FileText className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-foreground">PDF = onleesbaar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* De Oplossing */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              BSCPro converteert PDF direct naar <span className="text-[#00b8d9]">SnelStart-ready CAMT.053</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Wij overbruggen dit gat. Sleep je Rabobank PDF in onze veilige converter en download direct een strak CAMT.053 of MT940 bestand, precies opgemaakt zoals SnelStart het verwacht.
            </p>
          </div>

          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Waarom BSCPro?</h3>
                <ul className="space-y-3">
                  {[
                    'SnelStart officiële CAMT.053 output',
                    'Ondersteuning voor alle Rabobank PDF types',
                    '99.5% nauwkeurige transactieherkenning',
                    'Beveiligde, AVG-conforme verwerking',
                    'Direct klaar voor import in SnelStart'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00b8d9] shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-[#00b8d9]" />
                  <span className="font-semibold text-foreground">Veilig & Vertrouwd</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Je PDF wordt versleuteld verwerkt en na 24 uur automatisch verwijderd van onze servers.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 text-[#00b8d9] rounded-full text-xs font-medium">SSL Beveiligd</span>
                  <span className="px-3 py-1 bg-cyan-500/10 text-[#00b8d9] rounded-full text-xs font-medium">AVG Proof</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hoe het werkt */}
      <section className="py-20 bg-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Hoe het werkt</h2>
            <p className="text-muted-foreground text-lg">3 simpele stappen naar een geïmporteerd bankafschrift</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Stap 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border-2 border-[#00b8d9] flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-[#00b8d9]" />
              </div>
              <div className="text-[#00b8d9] font-bold text-sm mb-2">STAP 1</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Upload</h3>
              <p className="text-muted-foreground">
                Sleep je Rabobank PDF-afschrift veilig in onze tool. Ondersteuning voor zakelijke én particuliere rekeningen.
              </p>
            </div>

            {/* Stap 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border-2 border-[#00b8d9] flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-[#00b8d9]" />
              </div>
              <div className="text-[#00b8d9] font-bold text-sm mb-2">STAP 2</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Converteer</h3>
              <p className="text-muted-foreground">
                Ons systeem herkent alle transacties en genereert direct het juiste formaat. Kies voor <strong className="text-foreground">CAMT.053</strong> voor het beste resultaat in SnelStart.
              </p>
            </div>

            {/* Stap 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border-2 border-[#00b8d9] flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#00b8d9]" />
              </div>
              <div className="text-[#00b8d9] font-bold text-sm mb-2">STAP 3</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Importeer</h3>
              <p className="text-muted-foreground">
                Ga naar SnelStart, klik op <strong className="text-foreground">'Bankafschrift inlezen'</strong> en je administratie is weer up-to-date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Extra info */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">Veelgestelde vragen</h2>
          
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-2">Welke Rabobank PDF's worden ondersteund?</h3>
              <p className="text-muted-foreground">Alle typen Rabobank PDF's: zakelijke rekeningen, particuliere rekeningen, creditcard afschriften, en historische afschriften opgevraagd via Mijn Rabobank.</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-2">Welk formaat is het beste voor SnelStart?</h3>
              <p className="text-muted-foreground"><strong className="text-foreground">CAMT.053</strong> is het moderne formaat dat SnelStart het beste ondersteunt. Dit formaat bevat meer transactiedetails dan MT940 en wordt volledig automatisch verwerkt door SnelStart.</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-2">Is mijn data veilig?</h3>
              <p className="text-muted-foreground">Absoluut. Je PDF wordt versleuteld opgeslagen en na 24 uur automatisch verwijderd. We delen nooit data met derden en zijn volledig AVG-compliant.</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-2">Hoe lang duurt de conversie?</h3>
              <p className="text-muted-foreground">De meeste PDF's worden binnen <strong className="text-foreground">30 seconden</strong> geconverteerd. Grote afschriften of meerdere bestanden tegelijk kunnen iets langer duren, maar zelden meer dan 2 minuten.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Klaar om je Rabobank PDF te converteren?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start nu en ervaar hoe eenvoudig het importeren van je Rabobank afschriften in SnelStart kan zijn. 
            Geen gedoe meer met handmatig overtypen.
          </p>
          <Link href="/login">
            <button className="px-8 py-4 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold text-lg hover:shadow-[0_0_30px_rgba(0,184,217,0.4)] flex items-center justify-center gap-2 mx-auto">
              Start Nu met Converteren
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">Je eerste 2 conversies zijn volledig gratis</p>
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
