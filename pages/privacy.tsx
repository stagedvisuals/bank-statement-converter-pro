import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { Scale } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Privacybeleid | BSC Pro</title>
        <meta name="description" content="Privacybeleid van BSC Pro" />
      </Head>

      <Navbar />

      <main className="pt-32 pb-20 min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Scale className="w-16 h-16 text-[#00b8d9] mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Privacybeleid</h1>
          <p className="text-muted-foreground">
            Deze pagina wordt momenteel juridisch getoetst en geüpdatet. Kom binnenkort terug.
          </p>
        </div>
      </main>

      <footer className="py-6 text-center border-t border-border bg-background">
        <p className="text-sm text-muted-foreground">
          © 2026 BSC Pro. Alle rechten voorbehouden.
        </p>
      </footer>
    </div>
  );
}
