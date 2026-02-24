import { FileText, AlertTriangle, Scale, Shield } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden | BSC Pro',
  description: 'Onze algemene voorwaarden en gebruikersovereenkomst.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-teal-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Algemene Voorwaarden</h1>
          <p className="text-slate-400">Laatst bijgewerkt: 22 februari 2026</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none">
          {/* Important Disclaimer */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-amber-400 mb-2">
                  Belangrijke Disclaimer
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-white">De gebruiker is zelf verantwoordelijk</strong> voor 
                  de controle van de geconverteerde data. BSC Pro levert een technische conversie-dienst, 
                  maar wij zijn <strong className="text-white">niet aansprakelijk</strong> voor foutieve 
                  financiële beslissingen die zijn genomen op basis van de conversie. Controleer altijd 
                  de output voordat u deze gebruikt voor boekhouding, belastingaangifte of andere 
                  financiële doeleinden.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Scale className="w-6 h-6 text-teal-400" />
              Gebruiksvoorwaarden
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Door gebruik te maken van BSC Pro gaat u akkoord met deze voorwaarden. Onze dienst 
              is bedoeld voor het converteren van bankafschriften naar gestructureerde formaten 
              (Excel, CSV). U mag de dienst alleen gebruiken voor legitieme doeleinden en mag 
              geen pogingen doen om onze systemen te onderscheppen, kopiëren of misbruiken.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Aansprakelijkheid</h2>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span>
                    BSC Pro is <strong className="text-white">niet aansprakelijk</strong> voor financiële 
                    verliezen, gemiste kansen of schade voortkomend uit het gebruik van geconverteerde data.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span>
                    Wij garanderen een conversie-nauwkeurigheid van 99.5%, maar gebruikers dienen 
                    <strong className="text-white"> altijd de output te verifiëren</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span>
                    BSC Pro is niet verantwoordelijk voor beslissingen genomen door derden (boekhouders, 
                    belastingadviseurs) op basis van onze geconverteerde data.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Data Controle Verplichting</h2>
            <p className="text-slate-300 leading-relaxed">
              De gebruiker verklaart hierbij dat zij/zij:
            </p>
            <ul className="list-disc list-inside text-slate-300 mt-4 space-y-2">
              <li>Alle geconverteerde data zal controleren op juistheid</li>
              <li>Niet zal vertrouwen op de conversie zonder menselijke verificatie</li>
              <li>Verantwoordelijk blijft voor de uiteindelijke financiële administratie</li>
              <li>Begrijpt dat technische fouten altijd mogelijk zijn</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Intellectueel Eigendom</h2>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-teal-400" />
                <span className="text-lg font-semibold text-white">Copyright & Bescherming</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                © 2026 Bank Statement Converter Pro. Alle rechten voorbehouden. 
                Het kopiëren, reverse-engineeren, of ongeoorloofd gebruiken van deze software 
                en interface is strikt verboden. Onze code, algoritmes en gebruikersinterface 
                zijn proprietary en beschermd onder auteursrecht.
              </p>
              <p className="text-slate-300 leading-relaxed mt-4">
                Geëxporteerde bestanden bevatten een subtiele watermerk in de metadata 
                ter identificatie van de bron.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Service Level</h2>
            <p className="text-slate-300 leading-relaxed">
              BSC Pro streeft naar 99.9% uptime, maar garandeert geen ononderbroken beschikbaarheid. 
              We behouden ons het recht voor om onderhoud uit te voeren waarbij de dienst tijdelijk 
              niet beschikbaar kan zijn. Gebruikers wordt geadviseerd om tijdig exports te maken 
              van belangrijke data.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Account & Betaling</h2>
            <p className="text-slate-300 leading-relaxed">
              Abonnementen worden maandelijks automatisch verlengd. Opzeggen kan tot 24 uur voor 
              de verlengingsdatum. Terugbetalingen zijn niet mogelijk, tenzij wettelijk verplicht. 
              Misbruik van de dienst kan leiden tot account-suspensie zonder restitutie.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Wijzigingen</h2>
            <p className="text-slate-300 leading-relaxed">
              BSC Pro behoudt zich het recht voor om deze voorwaarden te wijzigen. Bij significante 
              wijzigingen zullen gebruikers via e-mail op de hoogte worden gesteld. Voortzetting van 
              gebruik na wijzigingen impliceert acceptatie van de nieuwe voorwaarden.
            </p>
          </section>

          <section className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-slate-400 text-sm">
              Voor vragen over deze voorwaarden kunt u contact opnemen via{' '}
              <a href="mailto:legal@bscpro.nl" className="text-teal-400 hover:underline">
                legal@bscpro.nl
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
