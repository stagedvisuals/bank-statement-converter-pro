export const metadata = {
  title: 'GDPR/AVG Compliance - BSCPro',
  description: 'BSCPro is volledig AVG-compliant. Lees hoe wij omgaan met persoonsgegevens.',
};

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">GDPR / AVG Compliance</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            BSCPro is volledig compliant met de Algemene Verordening Gegevensbescherming (AVG). 
            Jouw privacy is onze prioriteit.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Wie zijn wij?</h2>
          <p className="text-muted-foreground mb-4">
            <strong>BSCPro</strong><br />
            KvK: [KvK nummer]<br />
            Email: info@bscpro.nl
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Welke data verwerken wij?</h2>
          <ul className="list-disc pl-6 text-muted-foreground mb-6">
            <li><strong>E-mailadres</strong> - Voor je account en communicatie</li>
            <li><strong>Bankafschriften</strong> - Tijdelijk, maximaal 24 uur</li>
            <li><strong>IP-adres</strong> - Voor beveiliging en fraudepreventie</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Wettelijke grondslag</h2>
          <p className="text-muted-foreground mb-4">
            Wij verwerken je data op basis van:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-6">
            <li><strong>Toestemming</strong> - Bij aanmaken van een account</li>
            <li><strong>Overeenkomst</strong> - Voor het leveren van onze dienst</li>
            <li><strong>Wettelijke verplichting</strong> - Voor belastingaangifte etc.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Bewaartermijnen</h2>
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 font-medium">Bankafschriften</td>
                  <td className="py-2 text-muted-foreground">24 uur na verwerking, automatisch verwijderd</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Accountgegevens</td>
                  <td className="py-2 text-muted-foreground">Tot opzegging van je account</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Jouw rechten</h2>
          <p className="text-muted-foreground mb-4">Onder de AVG heb je de volgende rechten:</p>
          <ul className="list-disc pl-6 text-muted-foreground mb-6">
            <li><strong>Recht op inzage</strong> - Zie welke data wij van jou hebben</li>
            <li><strong>Recht op correctie</strong> - Wijzig onjuiste gegevens</li>
            <li><strong>Recht op verwijdering</strong> - Verwijder je account en data</li>
            <li><strong>Recht op bezwaar</strong> - Maak bezwaar tegen verwerking</li>
            <li><strong>Klacht indienen</strong> - Bij de Autoriteit Persoonsgegevens: <a href="https://autoriteitpersoonsgegevens.nl" className="text-[#00b8d9] hover:underline">autoriteitpersoonsgegevens.nl</a></li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Beveiliging</h2>
          <ul className="list-disc pl-6 text-muted-foreground mb-6">
            <li>SSL encryptie voor alle data-in-transit</li>
            <li>Encryptie van opgeslagen data</li>
            <li>Geen data wordt gedeeld met derden</li>
            <li>Reguliere beveiligingsaudits</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
          <p className="text-muted-foreground">
            Vragen over je privacy? Neem contact op via{' '}
            <a href="mailto:info@bscpro.nl" className="text-[#00b8d9] hover:underline">
              info@bscpro.nl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}