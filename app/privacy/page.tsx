export const metadata = {
  title: 'Privacy - BSCPro',
  description: 'Privacyverklaring BSCPro',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">Privacyverklaring</h1>
        <p className="text-muted-foreground mb-4">BSCPro verwerkt bankafschriften voor conversie.</p>
        <p className="text-muted-foreground mb-4">Data wordt versleuteld opgeslagen en na 24 uur verwijderd.</p>
        <p className="text-muted-foreground">Contact: info@bscpro.nl</p>
      </div>
    </div>
  );
}