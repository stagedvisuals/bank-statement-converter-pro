'use client';

import { useState, useCallback } from 'react';
import { Upload, Lock, ArrowRight } from 'lucide-react';

interface Transaction {
  datum: string;
  omschrijving: string;
  bedrag: string;
  categorie: string;
}

export default function DemoSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'idle' | 'analyzing' | 'recognized' | 'preview'>('idle');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handleFile(droppedFile);
    }
  }, []);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStep('analyzing');
    
    setTimeout(() => {
      setStep('recognized');
      const mockTransactions: Transaction[] = [
        { datum: '15-02-2025', omschrijving: 'Albert Heijn Amsterdam', bedrag: '-€45,20', categorie: 'Boodschappen' },
        { datum: '14-02-2025', omschrijving: 'Shell Tankstation', bedrag: '-€65,00', categorie: 'Transport' },
        { datum: '13-02-2025', omschrijving: 'Bol.com', bedrag: '-€89,95', categorie: 'Online' },
        { datum: '12-02-2025', omschrijving: 'Salaris februari', bedrag: '+€3.200,00', categorie: 'Inkomen' },
        { datum: '11-02-2025', omschrijving: 'KPN B.V.', bedrag: '-€55,00', categorie: 'Abonnement' },
      ];
      setTransactions(mockTransactions);
      setTimeout(() => setStep('preview'), 1000);
    }, 2000);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Probeer het nu — geen account nodig</h2>
          <p className="text-lg text-muted-foreground">Upload je bankafschrift en zie direct het resultaat</p>
        </div>

        {step === 'idle' && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              isDragging ? 'border-[#00b8d9] bg-[#00b8d9]/5' : 'border-border hover:border-[#00b8d9]/50'
            }`}
            onClick={() => document.getElementById('demo-file')?.click()}
          >
            <input id="demo-file" type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Sleep je bankafschrift hier</p>
            <p className="text-sm text-muted-foreground mb-6">of klik om te uploaden</p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>✓ ING</span><span>✓ Rabobank</span><span>✓ ABN AMRO</span><span>✓ SNS</span>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="animate-pulse">
              <p className="text-lg font-medium">AI analyseert je bankafschrift...</p>
              <div className="mt-6 h-2 bg-muted rounded-full max-w-md mx-auto">
                <div className="h-full bg-[#00b8d9] animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        )}

        {step === 'recognized' && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <p className="text-lg font-medium">Transacties herkend...</p>
            <div className="mt-4 flex justify-center gap-2">
              {[1,2,3].map(i => <div key={i} className="w-3 h-3 bg-[#00b8d9] rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }} />)}
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="p-4 border-b bg-muted/30 flex justify-between">
                <span className="text-sm font-medium">Voorbeeld (5 van 24 transacties)</span>
                <span className="text-xs text-emerald-500">✓ Resultaat klaar!</span>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr><th className="text-left p-3">Datum</th><th className="text-left p-3">Omschrijving</th><th className="text-left p-3">Bedrag</th><th className="text-left p-3">Categorie</th></tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i} className="border-b"><td className="p-3">{t.datum}</td><td className="p-3">{t.omschrijving}</td><td className="p-3 font-mono">{t.bedrag}</td><td className="p-3"><span className="px-2 py-1 bg-[#00b8d9]/10 text-[#00b8d9] rounded text-xs">{t.categorie}</span></td></tr>
                  ))}
                </tbody>
              </table>
              <div className="relative">
                <div className="h-24 bg-gradient-to-b from-transparent to-card blur-sm" />
                <div className="absolute inset-0 flex items-center justify-center bg-card/90">
                  <div className="text-center">
                    <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">🔒 Maak een gratis account aan om alle transacties te zien</p>
                    <a href="/register" className="inline-flex items-center gap-2 px-6 py-2 bg-[#00b8d9] text-[#080d14] rounded-lg font-medium"><ArrowRight className="w-4 h-4" />Gratis account</a>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">Start direct, geen creditcard nodig</p>
          </div>
        )}
      </div>
    </section>
  );
}