import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Algemene Voorwaarden | BSCPro',
  description: 'Algemene voorwaarden voor gebruik van BSCPro.',
};

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-4">Algemene Voorwaarden BSCPro</h1>
          <p className="text-muted-foreground mb-8">Versie: 1.0, maart 2026</p>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-8">
              BSCPro is een dienst van BSCPro, ingeschreven bij de KvK onder nummer [KVK NUMMER].
              Email: <a href="mailto:info@bscpro.nl" className="text-[#00b8d9] hover:underline">info@bscpro.nl</a>
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Definities</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li><strong>BSCPro:</strong> de aanbieder van de conversiedienst</li>
              <li><strong>Gebruiker:</strong> iedereen die een account aanmaakt</li>
              <li><strong>Dienst:</strong> het converteren van PDF bankafschriften</li>
              <li><strong>Account:</strong> persoonlijke toegang tot de dienst</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Toepasselijkheid</h2>
            <p className="text-muted-foreground mb-6">
              Deze voorwaarden gelden voor alle gebruik van BSCPro. Door registratie ga je akkoord met deze voorwaarden. 
              BSCPro behoudt het recht voorwaarden te wijzigen met 30 dagen voorafgaande kennisgeving.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. De Dienst</h2>
            <p className="text-muted-foreground mb-4">BSCPro biedt:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Conversie van PDF bankafschriften naar digitale formaten</li>
              <li>Ondersteunde formaten: MT940, CAMT.053, Excel, CSV, QBO</li>
              <li>Ondersteunde banken: ING, Rabobank, ABN AMRO, SNS, Bunq, Triodos en meer</li>
              <li>Nauwkeurigheid: 99.5% gemiddeld, geen garantie op 100%</li>
              <li>Beschikbaarheid: gestreefd naar 99.9% uptime</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Abonnementen en Betaling</h2>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <ul className="list-none space-y-2 text-muted-foreground">
                <li><strong>Losse scan:</strong> €2,00 per conversie</li>
                <li><strong>ZZP Plan:</strong> €15,00/maand (50 scans)</li>
                <li><strong>Pro Plan:</strong> €30,00/maand (onbeperkt)</li>
                <li><strong>Enterprise:</strong> €99,00/maand</li>
              </ul>
            </div>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Betaling via iDEAL, creditcard of automatische incasso</li>
              <li>Abonnement stilzwijgend verlengd tenzij opgezegd</li>
              <li>Opzeggen: minimaal 1 dag voor verlengingsdatum</li>
              <li>Geen restitutie voor lopende periode</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Gratis Trial</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>14 dagen gratis voor ZZP en Pro plan</li>
              <li>Geen creditcard vereist voor trial</li>
              <li>Na trial automatisch omgezet naar betaald (alleen na het invoeren van betaalgegevens)</li>
              <li>Trial kan worden stopgezet zonder kosten</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Aansprakelijkheid</h2>
            <p className="text-muted-foreground mb-4">BSCPro is niet aansprakelijk voor:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Fouten in de conversie (gebruiker verifieert altijd)</li>
              <li>Verlies van data door overmacht</li>
              <li>Indirecte schade of gevolgschade</li>
              <li>Schade door onjuist gebruik van de dienst</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              <strong>Maximale aansprakelijkheid:</strong> het betaalde bedrag in de 3 maanden voor het incident.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Intellectueel Eigendom</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>BSCPro software en technologie: eigendom van BSCPro</li>
              <li>Jouw bankafschriften: blijven jouw eigendom</li>
              <li>BSCPro gebruikt jouw data NIET voor training of analyse</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Gebruiksregels</h2>
            <p className="text-muted-foreground mb-4">Verboden gebruik:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Automatisch scrapen of misbruiken van de API</li>
              <li>Delen van accounttoegang</li>
              <li>Uploaden van andermans bankafschriften zonder toestemming</li>
              <li>Pogingen tot het omzeilen van beveiligingsmaatregelen</li>
            </ul>
            <p className="text-muted-foreground mb-6">Overtreding leidt tot directe accountopzegging zonder restitutie.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Opzegging en Beëindiging</h2>
            <p className="text-muted-foreground mb-4">Gebruiker kan account opzeggen via dashboard of email.</p>
            <p className="text-muted-foreground mb-4">BSCPro kan account opzeggen bij:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Niet-betaling na 14 dagen</li>
              <li>Overtreding gebruiksregels</li>
              <li>Fraude of misbruik</li>
            </ul>
            <p className="text-muted-foreground mb-6">Bij opzegging door BSCPro: restitutie van prepaid saldo.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Toepasselijk Recht en Geschillen</h2>
            <p className="text-muted-foreground mb-4">Nederlands recht is van toepassing.</p>
            <p className="text-muted-foreground mb-4">Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.</p>
            <p className="text-muted-foreground mb-6">
              Alternatief: geschillenbeslechting via <a href="https://ec.europa.eu/consumers/odr" className="text-[#00b8d9] hover:underline">ODR-platform</a>
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">11. Contact</h2>
            <p className="text-muted-foreground mb-2">Email: <a href="mailto:info@bscpro.nl" className="text-[#00b8d9] hover:underline">info@bscpro.nl</a></p>
            <p className="text-muted-foreground">Reactie binnen 2 werkdagen.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}