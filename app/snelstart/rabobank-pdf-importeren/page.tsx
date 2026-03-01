import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Rabobank naar SnelStart importeren | BSCPro',
  description: 'Importeer Rabobank PDF afschriften eenvoudig in SnelStart. Automatische conversie zonder handmatig werk.',
};

export default function SnelstartPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Rabobank naar SnelStart importeren</h1>
        <p className="text-lg text-muted-foreground mb-4">
          SnelStart is populair bij MKB-bedrijven, maar het handmatig invoeren van Rabobank transacties kost enorm veel tijd. BSCPro converteert je Rabobank PDF automatisch naar een formaat dat SnelStart direct importeert.
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ <strong>Belangrijk:</strong> BSCPro is een ondersteunend hulpmiddel. Controleer alle uitgelezen transactiedata altijd zelf voordat je deze gebruikt voor boekhouding of belastingaangifte. BSCPro is niet aansprakelijk voor fouten in de output.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Hoe werkt het?</h2>
        <div className="space-y-4 mb-12">
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">1</span>
            <div>
              <strong>Download je PDF van Rabobank Online</strong>
              <p className="text-muted-foreground">Log in op Rabobank Online en download je afschrift als PDF.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">2</span>
            <div>
              <strong>Upload bij BSCPro</strong>
              <p className="text-muted-foreground">Onze AI leest alle transacties uit je PDF met Hoge nauwkeurigheid - controleer altijd zelf.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">3</span>
            <div>
              <strong>Kies MT940 of CSV formaat</strong>
              <p className="text-muted-foreground">SnelStart accepteert beide formaten. MT940 is meest betrouwbaar.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">4</span>
            <div>
              <strong>Importeer in SnelStart</strong>
              <p className="text-muted-foreground">Ga in SnelStart naar Bank → Importeren en selecteer je bestand.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Waarom BSCPro?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="border rounded-xl p-4">
            <div className="text-2xl mb-2">⚡</div>
            <strong>Binnen 10 seconden</strong>
            <p className="text-muted-foreground text-sm">Van PDF upload naar downloadbaar bestand.</p>
          </div>
          <div className="border rounded-xl p-4">
            <div className="text-2xl mb-2">🔒</div>
            <strong>AVG-proof</strong>
            <p className="text-muted-foreground text-sm">Data wordt na 24 uur automatisch verwijderd.</p>
          </div>
          <div className="border rounded-xl p-4">
            <div className="text-2xl mb-2">✅</div>
            <strong>Hoge nauwkeurigheid</strong>
            <p className="text-muted-foreground text-sm">Geen handmatig controleren meer nodig.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Veelgestelde vragen</h2>
        <div className="space-y-4 mb-12">
          <div className="border rounded-xl p-4">
            <strong>Welk formaat werkt het beste met SnelStart?</strong>
            <p className="text-muted-foreground mt-2">SnelStart werkt het beste met MT940 bestanden. BSCPro genereert dit formaat automatisch uit je Rabobank PDF.</p>
          </div>
          <div className="border rounded-xl p-4">
            <strong>Werkt dit met alle Rabobank rekeningen?</strong>
            <p className="text-muted-foreground mt-2">Ja! Zakelijke rekening, privé rekening, spaarrekening — alle Rabobank PDF's worden ondersteund.</p>
          </div>
          <div className="border rounded-xl p-4">
            <strong>Is mijn bankafschrift veilig?</strong>
            <p className="text-muted-foreground mt-2">Ja. Je PDF wordt versleuteld verwerkt en na 24 uur automatisch verwijderd. Wij zijn volledig AVG-compliant.</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#00b8d9]/10 to-cyan-500/10 border border-[#00b8d9]/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Klaar om te beginnen?</h2>
          <p className="text-muted-foreground mb-6">Je eerste 2 conversies zijn gratis. Geen creditcard nodig.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold text-lg">
            Probeer gratis met jouw Rabobank afschrift →
          </Link>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}