import { Shield, Lock, Clock, Trash2, Eye, Server } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | BSC Pro',
  description: 'Onze privacy policy legt uit hoe we uw data beschermen en verwerken.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-teal-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Laatst bijgewerkt: 22 februari 2026</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-teal-400" />
              Data Minimization (Dataminimalisatie)
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Bij BSC Pro hanteren we het principe van dataminimalisatie. Dit betekent dat we 
              alleen de data verwerken die strikt noodzakelijk is voor het converteren van uw 
              bankafschriften. Wij verzamelen geen persoonlijke informatie die niet direct 
              relevant is voor onze dienstverlening.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Clock className="w-6 h-6 text-teal-400" />
              Bewaartermijn
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Uw ruwe bankafschriften worden <strong className="text-white">direct na verwerking</strong> van onze 
              servers verwijderd. In geen geval bewaren we uw originele PDF-bestanden langer dan 
              <strong className="text-white"> 24 uur</strong>. De geconverteerde data (Excel/CSV) blijft 
              beschikbaar in uw account tot u deze zelf verwijdert.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Trash2 className="w-6 h-6 text-teal-400" />
              Definitieve Verwijdering
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Wanneer bestanden worden verwijderd, gebeurt dit definitief en onherstelbaar. 
              We gebruiken secure deletion methodes die garanderen dat de data niet kan worden 
              teruggehaald. Onze servers maken geen backups van uw ruwe bankafschriften.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-teal-400" />
              Geen Verkoop aan Derden
            </h2>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">Wij verkopen uw data nooit aan derden.</strong> Uw 
              financiële informatie blijft strikt vertrouwelijk en wordt uitsluitend gebruikt voor 
              het doel waarvoor u onze dienst heeft ingeschakeld: het converteren van uw 
              bankafschriften. We delen geen informatie met adverteerders, partners of andere 
              commerciële partijen.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Server className="w-6 h-6 text-teal-400" />
              Beveiliging
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Alle data wordt versleuteld opgeslagen (AES-256) en verzonden via beveiligde 
              SSL/TLS verbindingen. Onze servers bevinden zich in de Europese Unie en voldoen 
              aan alle GDPR/AVG vereisten. We voeren regelmatig security audits uit om de 
              veiligheid van uw data te waarborgen.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Uw Rechten</h2>
            <p className="text-slate-300 leading-relaxed">
              Onder de AVG heeft u het recht om:
            </p>
            <ul className="list-disc list-inside text-slate-300 mt-4 space-y-2">
              <li>Inzage te vragen in uw persoonsgegevens</li>
              <li>Correctie of verwijdering van uw data te verzoeken</li>
              <li>Bezwaar te maken tegen verwerking</li>
              <li>Uw data te laten exporteren (data portaabiliteit)</li>
            </ul>
          </section>

          <section className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-slate-400 text-sm">
              Voor vragen over onze privacy policy kunt u contact opnemen via{' '}
              <a href="mailto:privacy@bscpro.nl" className="text-teal-400 hover:underline">
                privacy@bscpro.nl
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
