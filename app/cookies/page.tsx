import Link from 'next/link'

export const metadata = {
  title: 'Cookiebeleid | BSC Pro',
  description: 'Cookiebeleid voor BSC Pro - Bank Statement Converter',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#080d14] text-[#e8edf5]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-8">
          <Link href="/" className="text-[#00b8d9] hover:underline">
            ← Terug naar homepage
          </Link>
        </nav>

        <h1 className="text-4xl font-bold mb-8">Cookiebeleid</h1>
        <p className="text-[#6b7fa3] mb-8">Laatst bijgewerkt: 4 maart 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Wat zijn cookies?</h2>
            <p className="text-[#6b7fa3]">
              Cookies zijn kleine tekstbestanden die worden opgeslagen op je apparaat wanneer je onze website bezoekt.
              Ze helpen ons om de website beter te laten werken en je ervaring te verbeteren.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Welke cookies gebruiken we?</h2>
            
            <h3 className="text-xl font-semibold mb-3">Functionele cookies</h3>
            <p className="text-[#6b7fa3] mb-4">
              Deze cookies zijn noodzakelijk voor het functioneren van de website.
              Ze zorgen ervoor dat je kunt inloggen en je voorkeuren worden onthouden.
            </p>

            <h3 className="text-xl font-semibold mb-3">Analytische cookies</h3>
            <p className="text-[#6b7fa3] mb-4">
              We gebruiken Google Analytics om anonieme statistieken te verzamelen.
              Deze cookies helpen ons te begrijpen hoe bezoekers onze website gebruiken.
            </p>

            <h3 className="text-xl font-semibold mb-3">Preferentie cookies</h3>
            <p className="text-[#6b7fa3]">
              Deze cookies onthouden je voorkeuren, zoals taalinstellingen en thema-voorkeur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Cookiebeheer</h2>
            <p className="text-[#6b7fa3] mb-4">
              Je kunt cookies beheren via de instellingen van je browser:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#6b7fa3]">
              <li>Google Chrome: Instellingen → Privacy en beveiliging → Cookies</li>
              <li>Firefox: Opties → Privacy & Beveiliging → Cookies</li>
              <li>Safari: Voorkeuren → Privacy → Cookies en websitegegevens</li>
              <li>Edge: Instellingen → Cookies en sitetoestemmingen</li>
            </ul>
            <p className="text-[#6b7fa3] mt-4">
              Let op: als je cookies uitschakelt, werken sommige functies van onze website mogelijk niet optimaal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Cookies van derden</h2>
            <p className="text-[#6b7fa3]">
              We gebruiken diensten van derden die ook cookies kunnen plaatsen:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-[#6b7fa3]">
              <li>Stripe: Voor betalingsverwerking</li>
              <li>Google Analytics: Voor website-analyse</li>
              <li>Supabase: Voor database-opslag</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Meer informatie</h2>
            <p className="text-[#6b7fa3]">
              Voor vragen over ons cookiebeleid kun je contact opnemen via info@bscpro.nl
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
