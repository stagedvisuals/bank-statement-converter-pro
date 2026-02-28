export const metadata = {
  title: 'Voorwaarden - BSCPro',
  description: 'Algemene voorwaarden BSCPro',
};

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">Algemene Voorwaarden</h1>
        <p className="text-muted-foreground mb-4">BSCPro biedt een conversiedienst voor bankafschriften.</p>
        <p className="text-muted-foreground mb-4">Opzeggen mogelijk per maand.</p>
        <p className="text-muted-foreground">Toepasselijk recht: Nederlands recht.</p>
      </div>
    </div>
  );
}