import Link from 'next/link';

export const metadata = {
  title: 'Rabobank naar MT940 exporteren | BSCPro',
  description: 'Converteer Rabobank PDF afschriften naar MT940 formaat. Werkt met elk boekhoudpakket.',
};

export default function RabobankMt940Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Rabobank naar MT940 exporteren</h1>
        <p className="text-lg text-muted-foreground mb-8">
          MT940 is het standaard formaat voor banktransacties dat door vrijwel elk boekhoudpakket wordt ondersteund. BSCPro converteert je Rabobank PDF direct naar een proper MT940 bestand.
        </p>

        <h2 className="text-2xl font-bold mb-6">Hoe werkt het?</h2>
        <div className="space-y-4 mb-12">
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">1</span>
            <div>
              <strong>Download je Rabobank PDF</strong>
              <p className="text-muted-foreground">Vanuit Rabobank Online of de Rabobank App.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">2</span>
            <div>
              <strong>Upload bij BSCPro</strong>
              <p className="text-muted-foreground">Onze AI leest alle transacties uit je PDF.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">3</span>
            <div>
              <strong>Kies MT940 als export formaat</strong>
              <p className="text-muted-foreground">Selecteer MT940 uit de lijst met formaten.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">4</span>
            <div>
              <strong>Download en importeer</strong>
              <p className="text-muted-foreground">Het MT940 bestand werkt in Twinfield, Exact, AFAS, SnelStart en alle andere pakketten.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Waarom BSCPro?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="border rounded-xl p-4">
            <div className="text-2xl mb-2">⚡</div>
            <strong>Binnen 10 seconden</strong>
            <p className="text-muted-foreground text-sm">Van PDF upload naar downloadbaar MT940 bestand.</p>
          </div>
          <div className="border rounded-xl p-4">
            <div className="text-2xl mb-2">🔒</div>
            <strong>AVG-proof</strong>
            <p className="text-muted-foreground text-sm">Data wordt na 24 uur automatisch verwijderd.</p>
          </div>
          <div className="border rounded-xl p-4">
            <div className="text-2xl mb-2">✅</div>
            <strong>99.5% nauwkeurig</strong>
            <p className="text-muted-foreground text-sm">Correcte MT940 structuur, altijd compatibel.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Veelgestelde vragen</h2>
        <div className="space-y-4 mb-12">
          <div className="border rounded-xl p-4">
            <strong>In welke boekhoudpakketten werkt MT940?</strong>
            <p className="text-muted-foreground mt-2">MT940 wordt ondersteund door Twinfield, Exact Online, AFAS, SnelStart, Moneybird en vrijwel alle andere Nederlandse boekhoudsoftware.</p>
          </div>
          <div className="border rounded-xl p-4">
            <strong>Werkt dit met alle Rabobank rekeningen?</strong>
            <p className="text-muted-foreground mt-2">Ja! Particulier, zakelijk, spaarrekening — alle Rabobank PDF's worden ondersteund.</p>
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
            Converteer je Rabobank PDF naar MT940 →
          </Link>
        </div>
      </div>
    </div>
  );
}