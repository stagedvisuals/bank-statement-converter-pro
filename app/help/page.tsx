'use client'

import Link from 'next/link'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#080d14] text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-[#00b8d9] text-sm hover:underline mb-6 block">
            ← Terug naar home
          </Link>
          <h1 className="text-3xl font-bold mb-3">📖 Handleiding</h1>
          <p className="text-muted-foreground">
            Alles wat je moet weten om BSCPro optimaal te gebruiken.
          </p>
        </div>

        {/* Inhoudsopgave */}
        <div className="p-4 bg-card border border-border rounded-2xl mb-8">
          <p className="text-sm font-medium mb-3">Inhoudsopgave</p>
          <div className="space-y-2">
            {[
              { href: '#stap1', label: '1. Je eerste PDF scannen' },
              { href: '#stap2', label: '2. Resultaten bekijken' },
              { href: '#stap3', label: '3. Categorie aanpassen' },
              { href: '#stap4', label: '4. Exporteren' },
              { href: '#stap5', label: '5. Credits en abonnementen' },
              { href: '#banken', label: '6. Ondersteunde banken' },
              { href: '#faq', label: '7. Veelgestelde vragen' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-sm text-[#00b8d9] hover:underline"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Stap 1 */}
        <section id="stap1" className="mb-10 scroll-mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#00b8d9] text-[#080d14] rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Je eerste PDF scannen
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              BSCPro verwerkt PDF bankafschriften van alle grote Nederlandse banken. Volg deze stappen:
            </p>
            <div className="space-y-3">
              {[
                { icon: '🔐', title: 'Log in op je account', desc: 'Ga naar bscpro.nl/login en log in met je email en wachtwoord.' },
                { icon: '📄', title: 'Upload je PDF', desc: 'Sleep je bankafschrift naar het upload veld, of klik om een bestand te selecteren. Maximum bestandsgrootte: 10MB.' },
                { icon: '🤖', title: 'Wacht op de AI', desc: 'Onze AI analyseert je PDF en extraheert alle transacties automatisch. Dit duurt gemiddeld 10-30 seconden.' },
                { icon: '✅', title: 'Controleer het resultaat', desc: 'Bekijk de transactielijst en controleer of alles klopt. Je ziet een samenvatting van inkomsten en uitgaven.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <p className="text-amber-500 font-medium mb-1">💡 Tip</p>
              <p>Download je PDF altijd direct vanuit de app of website van je bank. Gescande PDFs (foto&apos;s) werken mogelijk minder goed.</p>
            </div>
          </div>
        </section>

        {/* Stap 2 */}
        <section id="stap2" className="mb-10 scroll-mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#00b8d9] text-[#080d14] rounded-full flex items-center justify-center text-sm font-bold">2</span>
            Resultaten bekijken
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>Na het scannen zie je een overzicht met:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: '🔢', label: 'Aantal transacties', desc: 'Totaal gevonden transacties' },
                { icon: '💚', label: 'Inkomsten', desc: 'Totaal positieve bedragen' },
                { icon: '🔴', label: 'Uitgaven', desc: 'Totaal negatieve bedragen' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-card border border-border rounded-xl text-center">
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <p className="font-medium text-foreground text-xs">{item.label}</p>
                  <p className="text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
            <p>
              Daaronder zie je een tabel met alle transacties inclusief datum, omschrijving, categorie en bedrag.
            </p>
            <div className="p-4 bg-card border border-border rounded-xl">
              <p className="font-medium text-foreground mb-2">📊 Categorieën overzicht</p>
              <p>
                Onderaan de transactielijst zie je een samenvatting van je uitgaven per categorie. Zo zie je in één oogopslag waar je geld naartoe gaat.
              </p>
            </div>
          </div>
        </section>

        {/* Stap 3 */}
        <section id="stap3" className="mb-10 scroll-mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#00b8d9] text-[#080d14] rounded-full flex items-center justify-center text-sm font-bold">3</span>
            Categorie aanpassen
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Herkent BSCPro een transactie niet correct? Pas de categorie eenvoudig aan:
            </p>
            <div className="space-y-3">
              {[
                { icon: '✏️', title: 'Klik op het potlood', desc: 'Elke transactierij heeft een ✏️ knop aan het einde. Klik hierop om de categorie te wijzigen.' },
                { icon: '🏷️', title: 'Selecteer de juiste categorie', desc: 'Kies uit meer dan 20 categorieën zoals Boodschappen, Vervoer, Telecom, Abonnementen, etc.' },
                { icon: '💾', title: 'Sla op en onthoud', desc: 'Klik op "Opslaan & Onthouden". BSCPro onthoudt dit patroon en past het automatisch toe bij toekomstige scans.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-[#00b8d9]/10 border border-[#00b8d9]/30 rounded-xl">
              <p className="text-[#00b8d9] font-medium mb-1">🧠 Zelflerend systeem</p>
              <p>
                Elke correctie die jij maakt helpt het systeem slimmer te worden. Als meerdere gebruikers dezelfde correctie maken, leert BSCPro dit patroon en past het automatisch toe voor iedereen.
              </p>
            </div>
          </div>
        </section>

        {/* Stap 4 */}
        <section id="stap4" className="mb-10 scroll-mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#00b8d9] text-[#080d14] rounded-full flex items-center justify-center text-sm font-bold">4</span>
            Exporteren
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>BSCPro ondersteunt 4 exportformaten:</p>
            <div className="space-y-3">
              {[
                { icon: '📊', format: 'Excel (.xlsx)', voor: 'Geschikt voor: persoonlijk gebruik, eigen administratie', tip: 'Opent direct in Microsoft Excel en Google Sheets' },
                { icon: '📄', format: 'CSV (.csv)', voor: 'Geschikt voor: importeren in boekhoudpakketten', tip: 'Universeel formaat dat door vrijwel alle software ondersteund wordt' },
                { icon: '🏦', format: 'MT940 (.mt940)', voor: 'Geschikt voor: Exact Online, Twinfield, AFAS, SnelStart', tip: 'Standaard bankformaat voor boekhoudkoppelingen' },
                { icon: '🔷', format: 'CAMT.053 (.xml)', voor: 'Geschikt voor: Europese boekhoudstandaard, Moneybird', tip: 'ISO 20022 standaard bankafschriftformaat' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-card border border-border rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{item.icon}</span>
                    <p className="font-medium text-foreground">{item.format}</p>
                  </div>
                  <p className="text-xs mb-1">{item.voor}</p>
                  <p className="text-xs text-[#00b8d9]">💡 {item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stap 5 */}
        <section id="stap5" className="mb-10 scroll-mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#00b8d9] text-[#080d14] rounded-full flex items-center justify-center text-sm font-bold">5</span>
            Credits en abonnementen
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>BSCPro werkt met een creditsysteem:</p>
            <div className="space-y-2">
              {[
                { label: 'Nieuw account', desc: '2 gratis credits om BSCPro te proberen' },
                { label: '1 credit = 1 scan', desc: 'Elke succesvolle PDF conversie kost 1 credit' },
                { label: 'Mislukte scan', desc: 'Bij een mislukte scan worden geen credits afgetrokken' },
                { label: 'Credits op?', desc: 'Upgrade je abonnement voor meer credits per maand' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-card border border-border rounded-xl">
                  <span className="text-[#00b8d9] font-bold text-xs mt-0.5">→</span>
                  <div>
                    <span className="font-medium text-foreground text-xs">{item.label}: </span>
                    <span className="text-xs">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Banken */}
        <section id="banken" className="mb-10 scroll-mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#00b8d9] text-[#080d14] rounded-full flex items-center justify-center text-sm font-bold">6</span>
            Ondersteunde banken
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              'ING', 'Rabobank', 'ABN AMRO', 'SNS Bank', 'Bunq', 'Revolut',
              'N26', 'Knab', 'Triodos', 'RegioBank', 'ASN Bank', 'en meer...'
            ].map((bank) => (
              <div key={bank} className="p-3 bg-card border border-border rounded-xl text-center text-xs font-medium">
                🏦 {bank}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            * Werkt BSCPro niet met jouw bank? Neem contact op via de{' '}
            <Link href="/contact" className="text-[#00b8d9] hover:underline">contactpagina</Link>.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-10 scroll-mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#00b8d9] text-[#080d14] rounded-full flex items-center justify-center text-sm font-bold">7</span>
            Veelgestelde vragen
          </h2>
          <div className="space-y-3">
            {[
              { q: 'Is mijn PDF veilig?', a: 'Ja. Je PDF wordt alleen gebruikt voor de verwerking en daarna automatisch verwijderd. We slaan je bankgegevens nooit op. Zie onze privacypagina voor meer details.' },
              { q: 'Wat als de scan niet goed is?', a: 'Probeer de PDF opnieuw te downloaden vanuit je bankapp. Zorg dat het een digitale PDF is en geen scan/foto. Bij een mislukte scan worden geen credits afgetrokken.' },
              { q: 'Kan ik meerdere maanden tegelijk uploaden?', a: 'Pro plan en hoger ondersteunt bulk upload van meerdere PDFs tegelijk. Met het Free en Starter plan upload je één PDF per keer.' },
              { q: 'Werkt BSCPro op mijn telefoon?', a: 'Ja, BSCPro is volledig geoptimaliseerd voor mobiel gebruik. Je kunt direct vanuit je bankapp een PDF exporteren en uploaden.' },
              { q: 'Hoe importeer ik in Exact Online?', a: 'Exporteer als MT940 formaat. Ga daarna in Exact Online naar Bank & Kas → Importeren → MT940 en selecteer het gedownloade bestand.' },
              { q: 'Mijn categorie klopt niet, wat nu?', a: 'Klik op het ✏️ icoontje naast de transactie en selecteer de juiste categorie. BSCPro onthoudt dit automatisch voor toekomstige scans.' },
            ].map((item, i) => (
              <details key={i} className="group p-4 bg-card border border-border rounded-xl cursor-pointer">
                <summary className="font-medium text-sm flex items-center justify-between list-none">
                  {item.q}
                  <span className="text-[#00b8d9] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <div className="p-6 bg-[#00b8d9]/10 border border-[#00b8d9]/30 rounded-2xl text-center">
          <p className="font-bold mb-2">Nog vragen?</p>
          <p className="text-sm text-muted-foreground mb-4">
            Staat je vraag er niet bij? Neem gerust contact op.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-[#00b8d9] text-[#080d14] rounded-xl font-bold text-sm hover:bg-[#00a8c9] transition-colors"
          >
            📧 Neem contact op
          </Link>
        </div>
      </div>
    </div>
  )
}
