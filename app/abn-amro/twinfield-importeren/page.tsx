import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ABN AMRO naar Twinfield importeren | BSCPro',
  description: 'Importeer ABN AMRO bankafschriften eenvoudig in Twinfield. Automatische conversie naar MT940.',
};

export default function TwinfieldAbnPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">ABN AMRO naar Twinfield importeren</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Twinfield is een krachtig boekhoudpakket dat veel wordt gebruikt door accountants. Maar ABN AMRO afschriften als PDF converteren naar een importeerbaar formaat? Dat doe je met BSCPro in 10 seconden.
        </p>

        <h2 className="text-2xl font-bold mb-6">Hoe werkt het?</h2>
        <div className="space-y-4 mb-12">
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">1</span>
            <div>
              <strong>Download je ABN AMRO PDF</strong>
              <p className="text-muted-foreground">Vanuit Internet Bankieren of de Mobiel Bankieren app.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">2</span>
            <div>
              <strong>Upload bij BSCPro</strong>
              <p className="text-muted-foreground">Onze AI leest alle transacties uit, zelfs bij lange omschrijvingen.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">3</span>
            <div>
              <strong>Download als MT940</strong>
              <p className="text-muted-foreground">Twinfield werkt het beste met MT940 formaat.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">4</span>
            <div>
              <strong>Importeer in Twinfield</strong>
              <p className="text-muted-foreground">Upload via Banktransacties → Importeren in Twinfield.</p>
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
            <strong>99.5% nauwkeurig</strong>
            <p className="text-muted-foreground text-sm">Geen handmatig controleren meer nodig.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Veelgestelde vragen</h2>
        <div className="space-y-4 mb-12">
          <div className="border rounded-xl p-4">
            <strong>Werkt dit met ABN AMRO Zakelijk?</strong>
            <p className="text-muted-foreground mt-2">Ja! Zowel particuliere als zakelijke ABN AMRO rekeningen worden ondersteund.</p>
          </div>
          <div className="border rounded-xl p-4">
            <strong>Moet ik iets installeren?</strong>
            <p className="text-muted-foreground mt-2">Nee. BSCPro werkt volledig in je browser. Geen software, geen plugins.</p>
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
            Probeer gratis met jouw ABN AMRO afschrift →
          </Link>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}