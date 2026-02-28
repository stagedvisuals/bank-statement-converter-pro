export const metadata = {
  title: 'Algemene Voorwaarden - BSCPro',
  description: 'Algemene voorwaarden voor het gebruik van BSCPro',
};

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">Algemene Voorwaarden</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-4">
            Deze algemene voorwaarden zijn van toepassing op alle diensten van BSCPro.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Dienstverlening</h2>
          <p className="text-muted-foreground mb-4">
            BSCPro biedt een online conversiedienst voor bankafschriften. 
            Wij converteren PDF bankafschriften naar verschillende boekhoudformaten.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Aansprakelijkheid</h2>
          <p className="text-muted-foreground mb-4">
            Onze aansprakelijkheid is beperkt tot het bedrag dat je voor je huidige 
            abonnementsperiode hebt betaald. Wij zijn niet aansprakelijk voor indirecte schade 
            of gevolgschade.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Opzegging</h2>
          <p className="text-muted-foreground mb-4">
            Je kunt je abonnement maandelijks opzeggen. De opzegging gaat in aan het 
            einde van de huidige factuurperiode.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Toepasselijk recht</h2>
          <p className="text-muted-foreground">
            Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden 
            voorgelegd aan de bevoegde rechter in Nederland.
          </p>
        </div>
      </div>
    </div>
  );
}