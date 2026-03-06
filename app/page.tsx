'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import FileConverterWithFreeScan from '../components/FileConverterWithFreeScan';

export default function Home() {
  const [enterpriseEmail, setEnterpriseEmail] = useState('');
  const [enterpriseSubmitted, setEnterpriseSubmitted] = useState(false);
  const [enterpriseLoading, setEnterpriseLoading] = useState(false);

  const handleEnterpriseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnterpriseLoading(true);
    try {
      await fetch('/api/enterprise-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: enterpriseEmail })
      });
    } catch {}
    setEnterpriseSubmitted(true);
    setEnterpriseEmail('');
    setEnterpriseLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>
              Converteer bankafschriften <span className="text-[#00b8d9]">in seconden</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Upload je PDF, laat onze AI de transacties uitlezen, en download direct een Excel/CSV of MT940 bestand.
            </p>
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="w-full max-w-xl">
                <FileConverterWithFreeScan />
              </div>
              <p className="text-xs text-muted-foreground">
                Eerste scan gratis • Geen creditcard nodig • AVG-proof
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
