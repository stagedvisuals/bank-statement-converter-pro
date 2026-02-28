export const metadata = {
  title: 'API Documentatie - BSCPro',
  description: 'API documentatie voor BSCPro integraties. Beschikbaar voor Pro en Enterprise klanten.',
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">API Documentatie</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            De BSCPro API is beschikbaar voor <strong>Pro en Enterprise klanten</strong>. 
            Met onze API kun je bankafschriften automatisch converteren naar boekhoudformaten.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Authenticatie</h2>
          <p className="text-muted-foreground mb-4">
            Alle API verzoeken vereisen een API key. Deze moet worden meegestuurd in de header:
          </p>
          <div className="bg-[#0f1419] border border-border rounded-lg p-4 mb-6">
            <code className="text-sm text-[#00b8d9]">
              x-api-key: JOUW_API_KEY
            </code>
          </div>
          <p className="text-muted-foreground mb-4">
            <a href="mailto:info@bscpro.nl?subject=API%20Key%20Aanvraag" className="text-[#00b8d9] hover:underline">
              Vraag hier je API key aan →
            </a>
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Endpoint</h2>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <code className="text-sm font-bold">POST /api/convert</code>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">Parameters</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mb-6">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-2">Parameter</th>
                  <th className="text-left py-3 px-2">Type</th>
                  <th className="text-left py-3 px-2">Beschrijving</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-2 font-mono text-[#00b8d9]">file</td>
                  <td className="py-3 px-2">File (PDF)</td>
                  <td className="py-3 px-2">Het bankafschrift PDF bestand (multipart/form-data)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-2 font-mono text-[#00b8d9]">bank</td>
                  <td className="py-3 px-2">string</td>
                  <td className="py-3 px-2">auto, ing, rabobank, abnamro, sns, bunq, triodos</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-2 font-mono text-[#00b8d9]">format</td>
                  <td className="py-3 px-2">string</td>
                  <td className="py-3 px-2">mt940, camt053, excel, csv, qbo</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">Response</h3>
          <p className="text-muted-foreground mb-4">
            Succesvolle response bevat een JSON object met de download URL:
          </p>
          <div className="bg-[#0f1419] border border-border rounded-lg p-4 mb-6">
            <pre className="text-sm text-green-400 overflow-x-auto">
{`{
  "success": true,
  "downloadUrl": "https://bscpro.nl/api/download/abc123",
  "expiresAt": "2025-02-28T23:59:59Z"
}`}
            </pre>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Voorbeeld request</h2>
          <p className="text-muted-foreground mb-4">Met cURL:</p>
          <div className="bg-[#0f1419] border border-border rounded-lg p-4 mb-6 overflow-x-auto">
            <code className="text-sm text-[#00b8d9] whitespace-pre">
{`curl -X POST https://bscpro.nl/api/convert \\
  -H "x-api-key: JOUW_API_KEY" \\
  -F "file=@bankafschrift.pdf" \\
  -F "bank=auto" \\
  -F "format=mt940"`}
            </code>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Rate Limits</h2>
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 font-medium">Pro</td>
                  <td className="py-2 text-muted-foreground">500 requests per maand</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Enterprise</td>
                  <td className="py-2 text-muted-foreground">Onbeperkt</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Status Codes</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-muted/30 p-3 rounded">
              <code className="text-green-500 font-bold">200</code>
              <span className="text-muted-foreground ml-2">OK - Succes</span>
            </div>
            <div className="bg-muted/30 p-3 rounded">
              <code className="text-amber-500 font-bold">400</code>
              <span className="text-muted-foreground ml-2">Bad Request</span>
            </div>
            <div className="bg-muted/30 p-3 rounded">
              <code className="text-red-500 font-bold">401</code>
              <span className="text-muted-foreground ml-2">Unauthorized</span>
            </div>
            <div className="bg-muted/30 p-3 rounded">
              <code className="text-amber-500 font-bold">429</code>
              <span className="text-muted-foreground ml-2">Rate Limit</span>
            </div>
            <div className="bg-muted/30 p-3 rounded">
              <code className="text-red-500 font-bold">500</code>
              <span className="text-muted-foreground ml-2">Server Error</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
          <p className="text-muted-foreground">
            Vragen over de API? Neem contact op via{' '}
            <a href="mailto:info@bscpro.nl" className="text-[#00b8d9] hover:underline">
              info@bscpro.nl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}