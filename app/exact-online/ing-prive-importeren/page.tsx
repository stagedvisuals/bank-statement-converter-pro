import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ING naar Exact Online importeren | BSCPro',
  description: 'Importeer ING bankafschriften direct in Exact Online. Automatische conversie naar CAMT.053 formaat.',
};

export default function ExactOnlineIngPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">ING naar Exact Online importeren</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Exact Online wordt door duizenden Nederlandse bedrijven gebruikt. Maar ING afschriften als PDF importeren? Dat gaat niet automatisch. BSCPro converteert je ING PDF naar CAMT.053 of MT940 formaat voor directe import in Exact Online.
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
              <strong>Download je ING PDF afschrift</strong>
              <p className="text-muted-foreground">Vanuit Mijn ING of de ING Zakelijk app, download je afschrift als PDF.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">2</span>
            <div>
              <strong>Upload bij BSCPro</strong>
              <p className="text-muted-foreground">Onze AI herkent alle transacties, inclusief onduidelijke omschrijvingen.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">3</span>
            <div>
              <strong>Kies CAMT.053 of MT940</strong>
              <p className="text-muted-foreground">Exact Online ondersteunt beide. CAMT.053 bevat de meeste details.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-[#00b8d9] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">4</span>
            <div>
              <strong>Importeer in Exact Online</strong>
              <p className="text-muted-foreground">Ga naar Bank → Bankafschriften importeren en upload je bestand.</p>
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
            <strong>Werkt dit met ING Zakelijk én ING Privé?</strong>
            <p className="text-muted-foreground mt-2">Ja! Zowel zakelijke als particuliere ING rekeningen worden volledig ondersteund.</p>
          </div>
          <div className="border rounded-xl p-4">
            <strong>Wat is het verschil tussen CAMT.053 en MT940?</strong>
            <p className="text-muted-foreground mt-2">CAMT.053 is moderner en bevat meer details. MT940 is breder ondersteund. BSCPro exporteert beide.</p>
          </div>
          <div className="border rounded-xl p-4">
            <strong>Is mijn bankafschrift veilig?</strong>
            <p className="text-muted-foreground mt-2">Ja. Je PDF wordt versleuteld verwerkt en na 24 uur automatisch verwijderd. Wij zijn volledig AVG-compliant.</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#00b8d9]/10 to-cyan-500/10 border border-[#00b8d9]/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Klaar om te beginnen?</h2>
          <p className="text-muted-foreground mb-6">Geen creditcard nodig.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold text-lg">
            Probeer gratis met jouw ING afschrift →
          </Link>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}