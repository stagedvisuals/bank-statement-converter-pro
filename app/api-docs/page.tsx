import { Construction, Code } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentatie | BSC Pro',
  description: 'BSC Pro API documentatie',
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Construction className="w-16 h-16 text-teal-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">API Documentatie</h1>
          <p className="text-[#6b7fa3]">Deze pagina wordt momenteel ontwikkeld en geüpdatet.</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 text-center">
          <Code className="w-12 h-12 text-teal-400 mx-auto mb-4" />
          <p className="text-slate-300 leading-relaxed max-w-md mx-auto">
            We werken aan een complete API documentatie voor ontwikkelaars. 
            Kom binnenkort terug voor:
          </p>
          <ul className="mt-6 space-y-2 text-slate-400">
            <li>• REST API endpoints</li>
            <li>• Authenticatie instructies</li>
            <li>• Code voorbeelden</li>
            <li>• SDK's en libraries</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
