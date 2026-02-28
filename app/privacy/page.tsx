import { Shield, Lock, Clock, Trash2, Eye, Server, AlertTriangle, FileText, UserCheck, Mail, Beaker } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacyverklaring | BSC PRO',
  description: 'Privacyverklaring voor de testfase van BSC PRO.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#080d14] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-[#00b8d9] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Privacyverklaring</h1>
          <p className="text-slate-400">Versie 1.0 - Testfase - 27 februari 2026</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none">
          {/* Beta/Testing banner */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <Beaker className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-purple-400 font-medium">🧪 Testfase / Beta</p>
                <p className="text-purple-400/80 text-sm mt-1">
                  BSC PRO bevindt zich momenteel in de testfase. Deze privacyverklaring is van toepassing 
                  op interne testers en quality assurance. Voor klanten volgt een aangepaste versie na 
                  KvK-registratie (april 2026).
                </p>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-[#00b8d9]" />
              1. Wie zijn wij?
            </h2>
            <p className="text-slate-300 leading-relaxed">
              BSC PRO is een softwarebedrijf in oprichting, gespecialiseerd in AI-gedreven documentverwerking 
              voor ondernemers. We bevinden ons momenteel in de testfase voor de officiële lancering.
            </p>
            <ul className="list-disc list-inside text-slate-300 mt-4 space-y-2">
              <li><strong>Website:</strong> https://www.bscpro.nl</li>
              <li><strong>E-mail:</strong> <a href="mailto:privacy@bscpro.nl" className="text-[#00b8d9] hover:underline">privacy@bscpro.nl</a></li>
              <li><strong>Status:</strong> In oprichting (KvK-registratie: april 2026)</li>
              <li><strong>Huidige fase:</strong> Interne testing & kwaliteitscontrole</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#00b8d9]" />
              2. Welke gegevens verwerken wij?
            </h2>
            
            <p className="text-slate-300 leading-relaxed mb-4">
              <strong>Belangrijk:</strong> Momenteel zijn er alleen testaccounts actief voor interne doeleinden. 
              Er zijn nog geen externe klanten of betalende gebruikers.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">2.1 Testaccount gegevens</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>E-mailadres (alleen interne testers)</li>
              <li>Wachtwoord (versleuteld)</li>
              <li>Testdocumenten (dummy data, geen echte klantdata)</li>
            </ul>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
              <p className="text-green-400 font-medium">✓ Geen echte klantdata</p>
              <p className="text-green-400/80 text-sm mt-1">
                Tijdens de testfase gebruiken we uitsluitend dummy/test documenten. 
                Er worden geen echte bankafschriften of facturen van derden verwerkt.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-[#00b8d9]" />
              3. Data beveiliging
            </h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li><strong>Versleuteling:</strong> Alle data wordt versleuteld opgeslagen (AES-256)</li>
              <li><strong>SSL/TLS:</strong> Alle verbindingen zijn beveiligd met HTTPS</li>
              <li><strong>Toegangscontrole:</strong> Alleen geautoriseerde teamleden hebben toegang</li>
              <li><strong>EU-servers:</strong> Alle data staat op servers binnen de EU</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Clock className="w-6 h-6 text-[#00b8d9]" />
              4. Bewaartermijnen
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 text-white font-medium">Type gegevens</th>
                    <th className="text-left py-3 text-white font-medium">Bewaartermijn</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-800">
                    <td className="py-3">Testaccount gegevens</td>
                    <td>Tot einde testfase of verwijdering</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3">Testdocumenten</td>
                    <td>Maximaal 30 dagen</td>
                  </tr>
                  <tr>
                    <td className="py-3">Logs & analytics</td>
                    <td>90 dagen</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Testfase afspraken</h2>
            <p className="text-slate-300 leading-relaxed">
              Als tester verklaar je dat je:
            </p>
            <ul className="list-disc list-inside text-slate-300 mt-4 space-y-2">
              <li>Alleen dummy/test data gebruikt, geen echte klantdata</li>
              <li>Geen productiegevoelige informatie uploadt</li>
              <li>Eventuele bugs of beveiligingsproblemen meldt</li>
              <li>Begrijpt dat de software in ontwikkeling is en fouten kan bevatten</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Naar officiële lancering</h2>
            <p className="text-slate-300 leading-relaxed">
              Na KvK-registratie (april 2026) zal deze privacyverklaring worden aangepast voor commercieel gebruik. 
              Alle testaccounts en testdata worden voor de lancering verwijderd tenzij anders afgesproken.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-[#00b8d9]" />
              7. Contact
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Vragen over deze privacyverklaring of de testfase?
            </p>
            <p className="mt-4">
              <strong>E-mail:</strong>{' '}
              <a href="mailto:privacy@bscpro.nl" className="text-[#00b8d9] hover:underline">
                privacy@bscpro.nl
              </a>
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500">
            <p>
              Deze privacyverklaring is specifiek voor de huidige testfase. 
              Bij de officiële lancering volgt een uitgebreide AVG-compliant privacyverklaring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
