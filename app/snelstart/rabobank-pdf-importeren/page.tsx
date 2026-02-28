export const metadata = {
  title: 'Rabobank naar SnelStart importeren | BSCPro',
  description: 'Importeer Rabobank PDF afschriften eenvoudig in SnelStart. Automatische conversie zonder handmatig werk.',
};

export default function SnelstartRabobankPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Rabobank naar SnelStart importeren
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Automatisch je Rabobank PDF afschriften omzetten naar SnelStart formaat. 
          Geen handmatig invoerwerk meer.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Stappenplan</h2>
            <ol className="space-y-3 text-muted-foreground">
              <li>1. Download je PDF van Rabobank Online</li>
              <li>2. Upload bij BSCPro</li>
              <li>3. Ontvang SnelStart compatibel bestand</li>
              <li>4. Importeer in SnelStart</li>
            </ol>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Voordelen</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Werkt met alle Rabobank rekeningen</li>
              <li>✓ Inclusief privé en zakelijke rekeningen</li>
              <li>✓ Ondersteunt MT940 en CSV</li>
              <li>✓ Geen technische kennis nodig</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#00b8d9]/10 to-cyan-500/10 border border-[#00b8d9]/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Probeer het nu</h2>
          <p className="text-muted-foreground mb-6">
            Je eerste conversie is gratis.
          </p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Start gratis →
          </a>
        </div>
      </div>
    </div>
  );
}