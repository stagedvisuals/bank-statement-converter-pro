import Link from 'next/link';

export const metadata = {
  title: 'ING naar AFAS importeren | BSCPro',
  description: 'Importeer ING bankafschriften in AFAS. Automatische conversie naar MT940 of CSV.',
};

export default function AfasIngPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">ING naar AFAS importeren</h1>
        <p className="text-lg text-muted-foreground mb-8">
          AFAS is één van de meest gebruikte boekhoudpakketten in Nederland. Maar ING afschriften als PDF verwerken in AFAS? Dat doe je handmatig of met BSCPro — en wij zijn veel sneller.
        </p>

        <h2 className="text-2xl font-bold mb-6">Hoe werkt het?</h2>
        <div className="space-y-4 mb-12">
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">1</span>
            <div>
              <strong>Download je ING PDF afschrift</strong>
              <p className="text-muted-foreground">Vanuit Mijn ING of de ING Zakelijk app.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">2</span>
            <div>
              <strong>Upload bij BSCPro</strong>
              <p className="text-muted-foreground">Onze AI herkent alle transacties automatisch.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">3</span>
            <div>
              <strong>Kies MT940 of CSV</strong>
              <p className="text-muted-foreground">AFAS accepteert beide formaten. MT940 is het meest compleet.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">4</span>
            <div>
              <strong>Importeer in AFAS</strong>
              <p className="text-muted-foreground">Ga in AFAS naar Bank → Bankafschrift importeren.</p>
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
            <strong>Welk formaat werkt het beste met AFAS?</strong>
            <p className="text-muted-foreground mt-2">AFAS ondersteunt zowel MT940 als CSV. MT940 wordt aanbevolen voor de beste compatibiliteit.</p>
          </div>
          <div className="border rounded-xl p-4">
            <strong>Werkt dit met alle ING rekeningen?</strong>
            <p className="text-muted-foreground mt-2">Ja! Betaalrekeningen, spaarrekeningen, zakelijke rekeningen — alle ING PDF's werken.</p>
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
            Probeer gratis met jouw ING afschrift →
          </Link>
        </div>
      </div>
    </div>
  );
}