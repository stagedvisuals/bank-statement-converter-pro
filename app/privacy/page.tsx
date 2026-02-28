import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacyverklaring | BSCPro',
  description: 'Hoe BSCPro omgaat met jouw persoonsgegevens.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-4">Privacyverklaring</h1>
          <p className="text-muted-foreground mb-8">Laatste update: maart 2026</p>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-8">
              BSCPro, gevestigd in Nederland, is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in deze verklaring.
              Contact: <a href="mailto:info@bscpro.nl" className="text-[#00b8d9] hover:underline">info@bscpro.nl</a>
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Welke gegevens verwerken wij?</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li><strong>E-mailadres:</strong> voor aanmaken en beheren van je account</li>
              <li><strong>Wachtwoord:</strong> versleuteld opgeslagen, nooit leesbaar</li>
              <li><strong>Bankafschriften (PDF):</strong> tijdelijk voor conversie, max 24 uur bewaard, daarna automatisch verwijderd</li>
              <li><strong>IP-adres:</strong> voor beveiliging en fraudepreventie</li>
              <li><strong>Gebruik van de dienst:</strong> welke functies je gebruikt, voor verbetering van de dienst</li>
              <li><strong>Betalingsgegevens:</strong> verwerkt via Stripe, BSCPro slaat geen betaalgegevens op</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Waarom verwerken wij deze gegevens?</h2>
            <p className="text-muted-foreground mb-4">Wettelijke grondslagen:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li><strong>Uitvoering overeenkomst (Art. 6 lid 1b AVG):</strong> account, conversie, betaling</li>
              <li><strong>Gerechtvaardigd belang (Art. 6 lid 1f AVG):</strong> beveiliging, fraudepreventie, verbetering dienst</li>
              <li><strong>Toestemming (Art. 6 lid 1a AVG):</strong> marketing emails (alleen met expliciete toestemming)</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Bewaartermijnen</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li><strong>Bankafschriften:</strong> automatisch verwijderd na 24 uur</li>
              <li><strong>Accountgegevens:</strong> bewaard tot opzegging + 30 dagen</li>
              <li><strong>Facturen en betalingshistorie:</strong> 7 jaar (wettelijke plicht)</li>
              <li><strong>Logs en beveiligingsdata:</strong> maximaal 90 dagen</li>
              <li><strong>Verwijderd account:</strong> alle data binnen 30 dagen gewist</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Met wie delen wij je gegevens?</h2>
            <p className="text-muted-foreground mb-4">Wij delen gegevens alleen met:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li><strong>Supabase</strong> (database hosting, VS - met SCC-garanties)</li>
              <li><strong>Stripe</strong> (betalingen, VS - Privacy Shield gecertificeerd)</li>
              <li><strong>Vercel</strong> (hosting, VS - met SCC-garanties)</li>
              <li><strong>Anthropic/OpenAI</strong> (AI verwerking, anoniem, geen opslag)</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              <strong>Wij verkopen NOOIT gegevens aan derden.</strong> Wij sturen NOOIT gegevens naar adverteerders.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Beveiliging</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Alle verbindingen via HTTPS/TLS encryptie</li>
              <li>Bankafschriften versleuteld opgeslagen</li>
              <li>Toegang tot data beperkt tot noodzakelijk personeel</li>
              <li>Regelmatige beveiligingsaudits</li>
              <li>Bij datalek: melding aan AP binnen 72 uur</li>
              <li>Bij datalek dat jou treft: directe melding per email</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Jouw rechten (AVG Art. 15-22)</h2>
            <p className="text-muted-foreground mb-4">Je hebt het recht op:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li><strong>Inzage:</strong> opvragen welke gegevens wij hebben</li>
              <li><strong>Correctie:</strong> onjuiste gegevens laten aanpassen</li>
              <li><strong>Verwijdering:</strong> je account en data laten wissen</li>
              <li><strong>Beperking:</strong> verwerking tijdelijk stopzetten</li>
              <li><strong>Bezwaar:</strong> tegen verwerking op basis van belang</li>
              <li><strong>Overdraagbaarheid:</strong> je data in leesbaar formaat</li>
              <li><strong>Klacht:</strong> bij <a href="https://autoriteitpersoonsgegevens.nl" className="text-[#00b8d9] hover:underline">Autoriteit Persoonsgegevens</a></li>
            </ul>
            <p className="text-muted-foreground mb-6">
              Verzoeken sturen naar: <a href="mailto:info@bscpro.nl" className="text-[#00b8d9] hover:underline">info@bscpro.nl</a> — Reactie binnen 30 dagen.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Cookies</h2>
            <p className="text-muted-foreground mb-4">BSCPro gebruikt:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li><strong>Functionele cookies:</strong> ingelogd blijven (noodzakelijk)</li>
              <li><strong>Analytische cookies:</strong> anoniem gebruiksstatistieken</li>
            </ul>
            <p className="text-muted-foreground mb-6">Geen tracking cookies, geen advertentiecookies.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Wijzigingen</h2>
            <p className="text-muted-foreground mb-6">
              Bij belangrijke wijzigingen ontvang je een email. Altijd de meest actuele versie op <Link href="/privacy" className="text-[#00b8d9] hover:underline">bscpro.nl/privacy</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}