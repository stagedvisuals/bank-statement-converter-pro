import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'PDF naar Moneybird importeren | BSCPro',
  description: 'Importeer eenvoudig je PDF bankafschriften in Moneybird. Automatische conversie naar het juiste formaat.',
};

export default function MoneybirdPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">PDF naar Moneybird importeren</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Veel ZZP'ers en boekhouders hebben hetzelfde probleem: Moneybird accepteert geen PDF bankafschriften. Je moet handmatig elke transactie invoeren — dat kost uren. BSCPro converteert je PDF automatisch naar een formaat dat Moneybird direct accepteert.
        </p>

        <h2 className="text-2xl font-bold mb-6">Hoe werkt het?</h2>
        <div className="space-y-4 mb-12">
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">1</span>
            <div>
              <strong>Upload je PDF bankafschrift</strong>
              <p className="text-muted-foreground">ING, Rabobank, ABN AMRO, SNS, Bunq of Triodos — alle banken werken.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">2</span>
            <div>
              <strong>AI herkent alle transacties</strong>
              <p className="text-muted-foreground">Onze AI leest datum, omschrijving en bedrag met 99.5% nauwkeurigheid.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">3</span>
            <div>
              <strong>Download als CSV of MT940</strong>
              <p className="text-muted-foreground">Kies het formaat dat Moneybird accepteert.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">4</span>
            <div>
              <strong>Importeer in Moneybird</strong>
              <p className="text-muted-foreground">Upload het bestand in Moneybird → Bankafschriften → Importeren. Klaar.</p>
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
            <strong>Welk formaat moet ik kiezen voor Moneybird?</strong>
            <p className="text-muted-foreground mt-2">Moneybird accepteert CSV en MT940. BSCPro exporteert beide formaten. Kies MT940 voor de beste compatibiliteit.</p>
          </div>
          <div className="border rounded-xl p-4">
            <strong>Werkt dit met alle banken?</strong>
            <p className="text-muted-foreground mt-2">Ja! ING, Rabobank, ABN AMRO, SNS, Bunq, Triodos — alle Nederlandse banken worden ondersteund.</p>
          </div>
          <div className="border rounded-xl p-4">
            <strong>Is mijn data veilig?</strong>
            <p className="text-muted-foreground mt-2">Absoluut. We gebruiken SSL-encryptie en verwijderen je data na 24 uur automatisch. We verkopen nooit data aan derden.</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#00b8d9]/10 to-cyan-500/10 border border-[#00b8d9]/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Klaar om tijd te besparen?</h2>
          <p className="text-muted-foreground mb-6">Je eerste 2 conversies zijn gratis. Geen creditcard nodig.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00b8d9] text-[#080d14] rounded-lg font-bold text-lg hover:shadow-lg transition-all">
            Start gratis proef →
          </Link>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}