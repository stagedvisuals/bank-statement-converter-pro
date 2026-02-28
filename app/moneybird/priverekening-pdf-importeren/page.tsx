export const metadata = {
  title: 'PDF naar Moneybird importeren | BSCPro',
  description: 'Importeer eenvoudig je PDF bankafschriften in Moneybird. Automatische conversie naar het juiste formaat.',
};

export default function MoneybirdPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">PDF naar Moneybird importeren</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Zet je PDF bankafschriften automatisch om naar een formaat dat Moneybird accepteert.
        </p>
        <div className="bg-gradient-to-r from-[#00b8d9]/10 to-cyan-500/10 border rounded-xl p-8 text-center">
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold">
            Start gratis proef →
          </a>
        </div>
      </div>
    </div>
  );
}