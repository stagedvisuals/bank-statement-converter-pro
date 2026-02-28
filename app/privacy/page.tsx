export const metadata = {
  title: 'Privacyverklaring - BSCPro',
  description: 'Hoe BSCPro omgaat met jouw privacy en data',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">Privacyverklaring</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-4">
            BSCPro verwerkt bankafschriften voor conversie naar boekhoudformaten. 
            Jouw privacy is voor ons van groot belang.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Dataverwerking</h2>
          <p className="text-muted-foreground mb-4">
            Alle data wordt versleuteld opgeslagen in onze beveiligde servers. 
            Na 24 uur worden alle bestanden en verwerkte data automatisch en definitief verwijderd.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Geen data deling</h2>
          <p className="text-muted-foreground mb-4">
            Wij delen geen data met derden. Je bankafschriften worden uitsluitend gebruikt 
            voor de conversiedienst en nergens anders voor.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Je rechten</h2>
          <p className="text-muted-foreground mb-4">
            Als gebruiker heb je recht op:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4">
            <li>Inzage in je verwerkte data</li>
            <li>Correctie van onjuiste data</li>
            <li>Verwijdering van je data</li>
            <li>Data export</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
          <p className="text-muted-foreground">
            Vragen over privacy? Neem contact op met info@bscpro.nl
          </p>
        </div>
      </div>
    </div>
  );
}