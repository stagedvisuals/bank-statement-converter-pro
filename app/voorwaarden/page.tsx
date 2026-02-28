import { FileText, AlertTriangle, Scale, Shield, Beaker, CheckCircle } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Testfase Voorwaarden | BSC PRO',
  description: 'Gebruiksvoorwaarden voor de testfase van BSC PRO.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#080d14] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-[#00b8d9] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Testfase Voorwaarden</h1>
          <p className="text-slate-400">Versie 1.0 - Interne Testing - 27 februari 2026</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none">
          {/* Beta/Testing banner */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <Beaker className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-purple-400 font-medium">🧪 Testfase / Beta</p>
                <p className="text-purple-400/80 text-sm mt-1">
                  Deze voorwaarden gelden voor de huidige testfase van BSC PRO. 
                  Het platform is nog in ontwikkeling en wordt getest door interne testers. 
                  Voor de officiële lancering (na KvK-registratie april 2026) volgen uitgebreide 
                  algemene voorwaarden voor klanten.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Scale className="w-6 h-6 text-[#00b8d9]" />
              1. Toepasselijkheid
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Deze voorwaarden zijn van toepassing op alle gebruikers die deelnemen aan de 
              testfase van BSC PRO. Door gebruik te maken van het platform tijdens de testfase 
              ga je akkoord met deze voorwaarden.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Wat is BSC PRO?</h2>
            <p className="text-slate-300 leading-relaxed">
              BSC PRO is een AI-gedreven tool voor het uitlezen en converteren van documenten 
              (bankafschriften, facturen) naar gestructureerde formaten zoals Excel en CSV.
            </p>
            
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-400 font-medium">⚠️ Belangrijk</p>
                  <p className="text-amber-400/80 text-sm mt-1">
                    BSC PRO is <strong>geen boekhoudsoftware</strong> en geeft <strong>geen fiscaal advies</strong>. 
                    We zijn een ondersteunend hulpmiddel, geen vervanging voor een boekhouder of accountant.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">3. AI en Nauwkeurigheid</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-white mb-3">3.1 Nauwkeurigheid</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Onze AI heeft een gemiddelde nauwkeurigheid van 85-99%</li>
                  <li>Fouten kunnen voorkomen, met name bij slechte scan-kwaliteit</li>
                  <li>Handgeschreven tekst wordt niet altijd correct herkend</li>
                  <li>Complexe tabellen kunnen verkeerd worden geïnterpreteerd</li>
                </ul>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-400 mb-2">3.2 Controleplicht</h3>
                <p className="text-red-400/80">
                  Je bent <strong>verplicht</strong> om alle uitgelezen data te controleren. 
                  BSC PRO is niet aansprakelijk voor:
                </p>
                <ul className="list-disc list-inside text-red-400/80 mt-2 space-y-1">
                  <li>Foutieve BTW-berekeningen</li>
                  <li>Verkeerde bedragen in exportbestanden</li>
                  <li>Gemiste transacties</li>
                  <li>Verkeerde categorisering</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Testfase Afspraken</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Als tester stem je in met het volgende:
            </p>
            <div className="bg-slate-800/50 rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#00b8d9] mt-0.5 flex-shrink-0" />
                <p className="text-slate-300">
                  <strong>Geen echte klantdata:</strong> Je gebruikt alleen dummy/test documenten, 
                  geen echte bankafschriften of facturen van klanten.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#00b8d9] mt-0.5 flex-shrink-0" />
                <p className="text-slate-300">
                  <strong>Fouten melden:</strong> Je rapporteert bugs, fouten of vreemd gedrag 
                  zodat we de software kunnen verbeteren.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#00b8d9] mt-0.5 flex-shrink-0" />
                <p className="text-slate-300">
                  <strong>Geheimhouding:</strong> Je deelt geen toegangscodes of testresultaten 
                  met derden zonder toestemming.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#00b8d9] mt-0.5 flex-shrink-0" />
                <p className="text-slate-300">
                  <strong>Begrip voor risico's:</strong> Je begrijpt dat dit beta-software is 
                  en fouten kan bevatten. Gebruik is op eigen risico.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Aansprakelijkheid</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-white">5.1 Beperking</h3>
              <p className="text-slate-300 leading-relaxed">
                Tijdens de testfase is BSC PRO niet aansprakelijk voor enige schade die voortvloeit 
                uit het gebruik van de software. Dit omvat, maar is niet beperkt tot:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>Dataverlies</li>
                <li>Financiële schade</li>
                <li>Gederfde winst</li>
                <li>Foutieve belastingaangiftes</li>
              </ul>
              
              <h3 className="text-xl font-medium text-white mt-6">5.2 Geen garantie</h3>
              <p className="text-slate-300 leading-relaxed">
                De software wordt geleverd "as is". We geven geen garantie op:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>100% nauwkeurigheid van de AI</li>
                <li>Ononderbroken beschikbaarheid</li>
                <li>Compatibiliteit met alle documentformaten</li>
                <li>Behoud van data (testdata kan worden verwijderd)</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectueel Eigendom</h2>
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#00b8d9]" />
                <span className="text-lg font-semibold text-white">Copyright & Bescherming</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                © 2026 BSC PRO. Alle rechten voorbehouden. Het kopiëren, reverse-engineeren, 
                of ongeoorloofd gebruiken van deze software en interface is strikt verboden. 
                Onze code, algoritmes en gebruikersinterface zijn proprietary en beschermd 
                onder auteursrecht.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Data en Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              Zie onze <Link href="/privacy" className="text-[#00b8d9] hover:underline">Privacyverklaring</Link> voor 
              details over hoe we omgaan met data tijdens de testfase.
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
              <p className="text-green-400 font-medium">✓ Geen echte klantdata</p>
              <p className="text-green-400/80 text-sm mt-1">
                We verwerken tijdens de testfase alleen dummy/test data. 
                Er worden geen echte bankgegevens of klantdocumenten opgeslagen.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">8. Einde testfase</h2>
            <p className="text-slate-300 leading-relaxed">
              De testfase eindigt bij de officiële lancering (april 2026, na KvK-registratie). 
              Alle testaccounts en testdata worden verwijderd tenzij anders afgesproken. 
              Na de lancering gelden nieuwe, uitgebreide algemene voorwaarden voor klanten.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">9. Wijzigingen</h2>
            <p className="text-slate-300 leading-relaxed">
              We kunnen deze voorwaarden tijdens de testfase aanpassen. Belangrijke wijzigingen 
              worden gecommuniceerd via e-mail of bij inloggen. Door gebruik te blijven maken 
              van het platform accepteer je de gewijzigde voorwaarden.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">10. Contact</h2>
            <p className="text-slate-300 leading-relaxed">
              Vragen over deze voorwaarden of de testfase?
            </p>
            <p className="mt-4 text-slate-300">
              <strong>E-mail:</strong>{' '}
              <a href="mailto:info@bscpro.nl" className="text-[#00b8d9] hover:underline">
                info@bscpro.nl
              </a>
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-sm text-slate-500">
              Door gebruik te maken van BSC PRO tijdens de testfase ga je akkoord met deze voorwaarden. 
              Bewaar deze pagina voor je administratie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
