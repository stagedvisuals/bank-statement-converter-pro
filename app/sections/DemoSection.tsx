'use client';

import { useState, useCallback } from 'react';
import { Upload, Lock, ArrowRight, FileSpreadsheet, Download, Eye, X } from 'lucide-react';

interface Transaction {
  datum: string;
  omschrijving: string;
  bedrag: number;
  categorie: string;
  tegenrekening?: string;
}

interface ParsedResult {
  bank: string;
  rekeningnummer: string;
  rekeninghouder: string;
  periode: { van: string; tot: string };
  transacties: Transaction[];
  saldoStart: number;
  saldoEind: number;
}

export default function DemoSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'idle' | 'uploading' | 'analyzing' | 'preview'>('idle');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parsedData, setParsedData] = useState<ParsedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [lockMode, setLockMode] = useState<'excel' | 'csv' | 'mt940' | null>(null);

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

  const handleFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setStep('uploading');
    setError(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('preview', 'true');

    try {
      setStep('analyzing');
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Er ging iets mis');
      }

      const data = await response.json();
      setParsedData(data);
      // Toon alleen eerste 10 transacties in preview
      setTransactions(data.transacties?.slice(0, 10) || []);
      setStep('preview');
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis bij het verwerken');
      setStep('idle');
    }
  };

  const handleExportClick = (mode: 'excel' | 'csv' | 'mt940') => {
    setLockMode(mode);
    setShowRegisterModal(true);
  };

  const formatBedrag = (bedrag: number) => {
    const formatted = new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(Math.abs(bedrag));
    return bedrag < 0 ? `-${formatted}` : `+${formatted}`;
  };

  const getTrustScore = (t: Transaction) => {
    // Mock trust scores gebaseerd op data kwaliteit
    if (t.datum && t.omschrijving && t.bedrag !== undefined) {
      return t.categorie && t.categorie !== 'overig' ? 95 : 85;
    }
    return 70;
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Probeer het nu — geen account nodig</h2>
          <p className="text-lg text-muted-foreground">Upload je bankafschrift en zie direct een preview</p>
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
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          </div>
        )}

        {step === 'uploading' && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <p className="text-lg font-medium">Bestand uploaden...</p>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="animate-pulse">
              <p className="text-lg font-medium">🤖 AI analyseert je bankafschrift...</p>
              <p className="text-sm text-muted-foreground mt-2">Dit duurt ongeveer 10-20 seconden</p>
              <div className="mt-6 h-2 bg-muted rounded-full max-w-md mx-auto">
                <div className="h-full bg-[#00b8d9] animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium">Preview: eerste {transactions.length} van {parsedData?.transacties?.length || 0} transacties</span>
                  {parsedData?.bank && (
                    <span className="ml-2 text-xs text-muted-foreground">({parsedData.bank})</span>
                  )}
                </div>
                <span className="text-xs text-emerald-500">✓ Herkend!</span>
              </div>
              
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="text-left p-3">Datum</th>
                    <th className="text-left p-3">Omschrijving</th>
                    <th className="text-left p-3">Bedrag</th>
                    <th className="text-left p-3">Categorie</th>
                    <th className="text-left p-3">Betrouwbaarheid</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3">{t.datum}</td>
                      <td className="p-3 max-w-xs truncate">{t.omschrijving}</td>
                      <td className={`p-3 font-mono ${t.bedrag < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {formatBedrag(t.bedrag)}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-[#00b8d9]/10 text-[#00b8d9] rounded text-xs capitalize">
                          {t.categorie || 'Overig'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getTrustScore(t) >= 90 ? 'bg-emerald-500' : getTrustScore(t) >= 80 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                              style={{ width: `${getTrustScore(t)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{getTrustScore(t)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Export knoppen - VERGRENDELD */}
              <div className="p-6 border-t bg-muted/20">
                <p className="text-sm font-medium mb-4 text-center">Download je volledige conversie</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button 
                    onClick={() => handleExportClick('excel')}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border rounded-lg hover:border-[#00b8d9] transition-colors group"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Excel</span>
                    <Lock className="w-3 h-3 text-muted-foreground group-hover:text-[#00b8d9]" />
                  </button>
                  <button 
                    onClick={() => handleExportClick('csv')}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border rounded-lg hover:border-[#00b8d9] transition-colors group"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">CSV</span>
                    <Lock className="w-3 h-3 text-muted-foreground group-hover:text-[#00b8d9]" />
                  </button>
                  <button 
                    onClick={() => handleExportClick('mt940')}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border rounded-lg hover:border-[#00b8d9] transition-colors group"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">MT940</span>
                    <Lock className="w-3 h-3 text-muted-foreground group-hover:text-[#00b8d9]" />
                  </button>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Maak een gratis account aan om te downloaden
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setStep('idle')}
                className="text-sm text-muted-foreground hover:text-[#00b8d9]"
              >
                ↻ Upload een ander bestand
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Registratie Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-[#00b8d9]" />
              <h3 className="text-lg font-semibold">Maak een gratis account aan</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Je hebt <strong>{parsedData?.transacties?.length || 0} transacties</strong> herkend. 
              Maak een gratis account aan om te downloaden als {lockMode?.toUpperCase()}.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-[#00b8d9]" />
                <span>Bekijk alle transacties</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Download className="w-4 h-4 text-[#00b8d9]" />
                <span>Exporteer naar Excel, CSV, MT940</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileSpreadsheet className="w-4 h-4 text-[#00b8d9]" />
                <span>Automatische categorisering</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <a href="/register" className="w-full">
                <button className="w-full bg-[#00b8d9] text-[#080d14] hover:bg-[#00b8d9]/90 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Gratis account aanmaken
                </button>
              </a>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="w-full border py-2.5 rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Annuleren
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              Geen creditcard nodig • GRATIS proefperiode
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
