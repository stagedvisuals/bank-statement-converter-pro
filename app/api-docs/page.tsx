export const metadata = {
  title: 'API Documentatie - BSCPro',
  description: 'API documentatie voor BSCPro integraties',
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">API Documentatie</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-4">
            De BSCPro API is beschikbaar voor Pro en Enterprise klanten. 
            Met onze API kun je bankafschriften automatisch converteren.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Endpoint</h2>
          <div className="bg-muted p-4 rounded-lg mb-4">
            <code className="text-sm">POST /api/convert</code>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Parameters</h2>
          <table className="w-full text-sm mb-4">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-2">Parameter</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Beschrijving</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2 font-mono">file</td>
                <td className="py-2">File (PDF)</td>
                <td className="py-2">Het bankafschrift PDF bestand</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-mono">bank</td>
                <td className="py-2">string</td>
                <td className="py-2">auto, ing, rabobank, abnamro, sns, bunq</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-mono">format</td>
                <td className="py-2">string</td>
                <td className="py-2">mt940, camt, excel, csv, qbo</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-xl font-semibold mt-8 mb-4">Authenticatie</h2>
          <p className="text-muted-foreground mb-4">
            Voeg je API key toe in de request header:
          </p>
          <div className="bg-muted p-4 rounded-lg mb-4">
            <code className="text-sm">x-api-key: jouw-api-key-hier</code>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Voorbeeld request</h2>
          <div className="bg-muted p-4 rounded-lg mb-4">
            <pre className="text-sm overflow-x-auto">
{`curl -X POST https://www.bscpro.nl/api/convert \\
  -H "x-api-key: jouw-api-key" \\
  -F "file=@bankafschrift.pdf" \\
  -F "bank=ing" \\
  -F "format=mt940"`}
            </pre>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Rate Limits</h2>
          <ul className="list-disc pl-6 text-muted-foreground mb-4">
            <li>Pro: 100 requests per uur</li>
            <li>Enterprise: 1000 requests per uur</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">API Key aanvragen</h2>
          <p className="text-muted-foreground">
            Contact info@bscpro.nl om een API key aan te vragen.
          </p>
        </div>
      </div>
    </div>
  );
}