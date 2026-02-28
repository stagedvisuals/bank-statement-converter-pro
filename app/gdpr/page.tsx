export const metadata = {
  title: 'GDPR/AVG - BSCPro',
  description: 'BSCPro is AVG-compliant. Lees hoe wij omgaan met persoonsgegevens.',
};

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">GDPR / AVG Compliance</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-4">
            BSCPro is volledig compliant met de Algemene Verordening Gegevensbescherming (AVG).
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Data minimalisatie</h2>
          <p className="text-muted-foreground mb-4">
            Wij verwerken alleen de data die strikt noodzakelijk is voor het converteren 
            van je bankafschriften. Geen onnodige gegevens worden opgeslagen.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Bewaartermijn</h2>
          <p className="text-muted-foreground mb-4">
            Alle bankafschriften en verwerkte data worden automatisch verwijderd na 24 uur. 
            Dit is ons standaard beleid voor alle gebruikers.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Verwerkersovereenkomst</h2>
          <p className="text-muted-foreground mb-4">
            Een verwerkersovereenkomst (VWO) is beschikbaar op verzoek voor zakelijke klanten. 
            Neem contact op met info@bscpro.nl voor meer informatie.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Je rechten onder GDPR</h2>
          <ul className="list-disc pl-6 text-muted-foreground mb-4">
            <li>Recht op inzage</li>
            <li>Recht op rectificatie</li>
            <li>Recht op vergetelheid</li>
            <li>Recht op dataportabiliteit</li>
            <li>Recht van bezwaar</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
          <p className="text-muted-foreground">
            Voor GDPR/AVG vragen: info@bscpro.nl
          </p>
        </div>
      </div>
    </div>
  );
}