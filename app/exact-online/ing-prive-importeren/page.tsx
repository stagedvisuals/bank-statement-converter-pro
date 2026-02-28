export const metadata = {
  title: 'ING naar Exact Online importeren | BSCPro',
  description: 'Importeer ING bankafschriften direct in Exact Online. Automatische conversie naar CAMT.053 formaat.',
};

export default function ExactOnlineIngPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          ING naar Exact Online importeren
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Zet je ING PDF afschriften om naar Exact Online formaat. 
          Ondersteunt zowel privé als zakelijke rekeningen.
        </p>

        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Geschikt voor</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">ING Privé</h3>
              <p className="text-sm text-muted-foreground">Betaalrekening, Spaarrekening</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">ING Zakelijk</h3>
              <p className="text-sm text-muted-foreground">Zakelijke rekening, Creditcard</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#00b8d9]/10 to-cyan-500/10 border border-[#00b8d9]/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Start met importeren</h2>
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Probeer gratis →
          </a>
        </div>
      </div>
    </div>
  );
}