export const metadata = {
  title: 'API Docs - BSCPro',
  description: 'API documentatie voor BSCPro',
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">API Documentatie</h1>
        <p className="text-muted-foreground mb-4">Beschikbaar voor Pro en Enterprise klanten.</p>
        <h2 className="text-xl font-semibold mt-8 mb-4">Endpoint</h2>
        <code className="bg-muted p-2 rounded">POST /api/convert</code>
        <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
        <p className="text-muted-foreground">info@bscpro.nl</p>
      </div>
    </div>
  );
}