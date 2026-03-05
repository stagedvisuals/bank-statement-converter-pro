import Link from 'next/link'

export const metadata = {
  title: 'Algemene Voorwaarden | BSC Pro',
  description: 'Algemene voorwaarden voor BSC Pro - Bank Statement Converter',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#080d14] text-[#e8edf5]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-8">
          <Link href="/" className="text-[#00b8d9] hover:underline">
            ← Terug naar homepage
          </Link>
        </nav>

        <h1 className="text-4xl font-bold mb-8">Algemene Voorwaarden</h1>
        <p className="text-[#6b7fa3] mb-8">Laatst bijgewerkt: 4 maart 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Toepasselijkheid</h2>
            <p className="text-[#6b7fa3]">
              Deze algemene voorwaarden zijn van toepassing op alle diensten van BSC Pro.
              Door gebruik te maken van onze diensten ga je akkoord met deze voorwaarden.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Diensten</h2>
            <p className="text-[#6b7fa3]">
              BSC Pro biedt een dienst voor het converteren van bankafschriften naar verschillende formaten.
              We streven naar een zo hoog mogelijke nauwkeurigheid, maar kunnen geen 100% garantie geven.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Account</h2>
            <p className="text-[#6b7fa3]">
              Voor het gebruik van onze diensten is een account vereist.
              Je bent zelf verantwoordelijk voor het geheim houden van je inloggegevens.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Betalingen</h2>
            <p className="text-[#6b7fa3]">
              Betalingen verlopen via Stripe. Abonnementen worden automatisch verlengd.
              Je kunt je abonnement op elk moment opzeggen via je accountinstellingen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Aansprakelijkheid</h2>
            <p className="text-[#6b7fa3]">
              BSC Pro is een ondersteunend hulpmiddel. Controleer alle uitgelezen data altijd zelf.
              Wij zijn geen boekhoudkantoor en geven geen fiscaal advies.
            </p>
            <p className="text-[#6b7fa3] mt-4">
              Onze aansprakelijkheid is beperkt tot het bedrag van je laatste betaling.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Intellectueel eigendom</h2>
            <p className="text-[#6b7fa3]">
              Alle intellectuele eigendomsrechten op de software en website berusten bij BSC Pro.
              Je krijgt een licentie om de diensten te gebruiken volgens deze voorwaarden.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Opzegging</h2>
            <p className="text-[#6b7fa3]">
              Je kunt je account op elk moment opzeggen via je accountinstellingen.
              Bij opzegging vervalt je toegang tot de diensten aan het einde van de betaalde periode.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Wijzigingen</h2>
            <p className="text-[#6b7fa3]">
              We behouden ons het recht voor om deze voorwaarden te wijzigen.
              Belangrijke wijzigingen communiceren we via e-mail.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Toepasselijk recht</h2>
            <p className="text-[#6b7fa3]">
              Op deze voorwaarden is Nederlands recht van toepassing.
              Geschillen worden voorgelegd aan de bevoegde rechter in Amsterdam.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contact</h2>
            <p className="text-[#6b7fa3]">
              Voor vragen over deze voorwaarden:<br/>
              E-mail: info@bscpro.nl
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
