export const metadata = {
  title: 'GDPR/AVG - BSCPro',
  description: 'BSCPro is volledig AVG-compliant. Lees hoe wij omgaan met persoonsgegevens.',
};

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">GDPR / AVG Compliance</h1>
        <p className="text-muted-foreground mb-4">BSCPro is volledig compliant met de Algemene Verordening Gegevensbescherming (AVG).</p>
        <h2 className="text-xl font-semibold mt-8 mb-4">Data minimalisatie</h2>
        <p className="text-muted-foreground mb-4">Wij verwerken alleen de data die strikt noodzakelijk is voor het converteren van je bankafschriften.</p>
        <h2 className="text-xl font-semibold mt-8 mb-4">Bewaartermijn</h2>
        <p className="text-muted-foreground mb-4">Alle bankafschriften worden automatisch verwijderd na 24 uur.</p>
        <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
        <p className="text-muted-foreground">info@bscpro.nl</p>
      </div>
    </div>
  );
}