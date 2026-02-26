import { Shield, Construction } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GDPR / AVG | BSC Pro',
  description: 'GDPR en AVG naleving bij BSC Pro',
};

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Construction className="w-16 h-16 text-teal-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">GDPR / AVG</h1>
          <p className="text-[#6b7fa3]">Deze pagina wordt momenteel juridisch getoetst en geüpdatet.</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 text-center">
          <Shield className="w-12 h-12 text-teal-400 mx-auto mb-4" />
          <p className="text-slate-300 leading-relaxed max-w-md mx-auto">
            We werken aan een complete uitleg van hoe wij voldoen aan de GDPR (AVG) richtlijnen. 
            Kom binnenkort terug voor meer informatie over:
          </p>
          <ul className="mt-6 space-y-2 text-slate-400">
            <li>• Uw rechten onder de AVG</li>
            <li>• Hoe wij persoonsgegevens verwerken</li>
            <li>• Data-bewaartermijnen en verwijdering</li>
            <li>• Contactgegevens functionaris gegevensbescherming</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
