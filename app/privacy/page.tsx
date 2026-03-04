import Link from 'next/link'

export const metadata = {
  title: 'Privacyverklaring | BSC Pro',
  description: 'Privacyverklaring voor BSC Pro - Bank Statement Converter',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#080d14] text-[#e8edf5]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-8">
          <Link href="/" className="text-[#00b8d9] hover:underline">
            ← Terug naar homepage
          </Link>
        </nav>

        <h1 className="text-4xl font-bold mb-8">Privacyverklaring</h1>
        <p className="text-[#6b7fa3] mb-8">Laatst bijgewerkt: 4 maart 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Wie wij zijn</h2>
            <p className="text-[#6b7fa3]">
              BSC Pro is een dienst voor het converteren van bankafschriften naar verschillende formaten.
              Ons websiteadres is: https://www.bscpro.nl
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Welke persoonsgegevens we verzamelen en waarom</h2>
            <h3 className="text-xl font-semibold mb-3">Accountgegevens</h3>
            <p className="text-[#6b7fa3] mb-4">
              Wanneer je een account aanmaakt, vragen we om je naam, e-mailadres en bedrijfsnaam.
              Deze gegevens gebruiken we om je account te beheren en je te kunnen helpen.
            </p>

            <h3 className="text-xl font-semibold mb-3">Bankafschriften</h3>
            <p className="text-[#6b7fa3] mb-4">
              De bankafschriften die je uploadt worden tijdelijk verwerkt om ze te converteren.
              We bewaren deze bestanden niet langer dan nodig is voor de verwerking.
            </p>

            <h3 className="text-xl font-semibold mb-3">Analytische gegevens</h3>
            <p className="text-[#6b7fa3]">
              We gebruiken anonieme analytische gegevens om onze dienst te verbeteren.
              Deze gegevens kunnen niet naar individuele gebruikers worden herleid.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Met wie we gegevens delen</h2>
            <p className="text-[#6b7fa3]">
              We delen je gegevens niet met derden, behalve wanneer dit noodzakelijk is voor:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-[#6b7fa3]">
              <li>Het verwerken van betalingen (via Stripe)</li>
              <li>Het versturen van e-mails (via Resend)</li>
              <li>Het opslaan van gegevens (via Supabase)</li>
              <li>Het verwerken van AI-analyses (via Groq)</li>
            </ul>
            <p className="text-[#6b7fa3] mt-4">
              Al onze leveranciers zijn GDPR-compliant en hebben strikte privacyovereenkomsten.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Hoe lang we je gegevens bewaren</h2>
            <p className="text-[#6b7fa3]">
              Accountgegevens: Zolang je account actief is<br/>
              Uploadede bestanden: Maximaal 24 uur na verwerking<br/>
              Analytische gegevens: Maximaal 12 maanden
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Je rechten</h2>
            <p className="text-[#6b7fa3] mb-4">
              Je hebt het recht om:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#6b7fa3]">
              <li>Inzage te vragen in je gegevens</li>
              <li>Je gegevens te laten corrigeren</li>
              <li>Je gegevens te laten verwijderen</li>
              <li>Bezwaar te maken tegen verwerking</li>
              <li>Je gegevens over te dragen</li>
            </ul>
            <p className="text-[#6b7fa3] mt-4">
              Voor vragen over je privacyrechten kun je contact opnemen via info@bscpro.nl
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Contactgegevens</h2>
            <p className="text-[#6b7fa3]">
              Voor vragen over deze privacyverklaring:<br/>
              E-mail: info@bscpro.nl
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
