import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { FileText, Upload, Download, Zap, AlertTriangle, LogOut, Loader2, Brain, FileSpreadsheet, Database, FileCode, Table, History, Settings, LayoutDashboard, Calculator, Lightbulb, CheckCircle2, Calendar, Sun, Moon } from 'lucide-react';
import { Logo } from '../components/Logo';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all"
      title={isDark ? 'Schakel naar licht thema' : 'Schakel naar donker thema'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[#00b8d9]" />
      ) : (
        <Moon className="w-5 h-5 text-[#00b8d9]" />
      )}
    </button>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'extracting' | 'done' | 'error'>('idle');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [bank, setBank] = useState<string>('');
  const [rekeningnummer, setRekeningnummer] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [categorySummary, setCategorySummary] = useState<any[]>([]);
  const [selectedExport, setSelectedExport] = useState<'excel' | 'mt940' | 'csv' | 'camt'>('excel');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('bscpro_session');
    const userData = localStorage.getItem('bscpro_user');
    if (!session) { router.push('/login'); return; }
    if (userData) setUser(JSON.parse(userData));
  }, [router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) { setFile(e.target.files[0]); setError(''); }
  };

  const handleUpload = async () => {
    if (!file) { setError('Selecteer eerst een bestand'); return; }
    setScanStatus('uploading');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/convert', { method: 'POST', body: formData });
      setScanStatus('analyzing');
      await new Promise(r => setTimeout(r, 500));
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Upload mislukt'); }
      const data = await response.json();
      if (!data.success || !data.transactions?.length) throw new Error(data.error || 'Geen transacties gevonden');
      setScanStatus('extracting');
      await new Promise(r => setTimeout(r, 500));
      setTransactions(data.transactions);
      setBank(data.bank || 'Onbekend');
      setRekeningnummer(data.rekeningnummer || '');
      setCategorySummary(data.categorySummary || []);
      setScanStatus('done');
    } catch (err: any) { setError(err.message); setScanStatus('error'); }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const endpoints: any = { excel: '/api/export/excel', mt940: '/api/export/mt940', csv: '/api/export/csv', camt: '/api/export/camt' };
      const filenames: any = { excel: `BSC-PRO-${bank}-Export.xlsx`, mt940: `BSC-PRO-${bank}-MT940.sta`, csv: `BSC-PRO-${bank}-Export.csv`, camt: `BSC-PRO-${bank}-CAMT053.xml` };
      const response = await fetch(endpoints[selectedExport], {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, bank, rekeningnummer, user })
      });
      if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'Export mislukt'); }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filenames[selectedExport]; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch (err: any) { setError('Export mislukt: ' + err.message); }
    finally { setExportLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem('bscpro_session'); localStorage.removeItem('bscpro_user'); router.push('/login'); };
  const getStatusText = () => { const m: any = { uploading: 'Document wordt geüpload...', analyzing: 'AI analyseert document-layout...', extracting: 'Data wordt gevalideerd...', done: 'Klaar!', error: 'Fout opgetreden' }; return m[scanStatus] || ''; };
  
  const btw21 = transactions.filter(t => t.btw?.rate === 21).reduce((sum, t) => sum + (t.bedrag * 0.21), 0);
  const btw9 = transactions.filter(t => t.btw?.rate === 9).reduce((sum, t) => sum + (t.bedrag * 0.09), 0);
  const btw0 = transactions.filter(t => t.btw?.rate === 0).reduce((sum, t) => sum + t.bedrag, 0);
  const totalBtw = btw21 + btw9;

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 text-[#00b8d9] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Head><title>Dashboard - BSC Pro</title></Head>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="no-underline">
                <Logo />
              </Link>
              <div className="hidden md:flex items-center gap-2">
                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-[#00b8d9] bg-cyan-500/15 rounded-md text-sm font-medium">
                  <LayoutDashboard className="w-4 h-4" />Dashboard
                </Link>
                <Link href="/tools/btw-calculator" className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground text-sm">
                  <Calculator className="w-4 h-4" />Tools
                </Link>
                <Link href="/history" className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground text-sm">
                  <History className="w-4 h-4" />Geschiedenis
                </Link>
                <Link href="/onboarding" className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground text-sm">
                  <Settings className="w-4 h-4" />Instellingen
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm hidden sm:block">{user?.email}</span>
              <ThemeToggle />
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-muted-foreground border border-cyan-500/30 rounded-md hover:text-[#00b8d9] transition-colors text-sm">
                <LogOut className="w-4 h-4" />Uitloggen
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Document Scanner</h1>
          <p className="text-muted-foreground">Upload je bankafschrift of factuur. De AI leest automatisch alle transacties.</p>
        </div>

        {/* Upload Card */}
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          {!file ? (
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-[#00b8d9]/50 transition-colors">
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-[#00b8d9]" />
                <p className="text-lg font-medium text-foreground mb-2">Klik om document te uploaden</p>
                <p className="text-sm text-muted-foreground">PDF, JPG, of PNG (max 10MB)</p>
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-background border border-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-[#00b8d9]" />
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {scanStatus === 'idle' && (
                <div className="flex gap-2">
                  <button onClick={() => setFile(null)} className="px-4 py-2 text-muted-foreground border border-border rounded-md hover:text-foreground">Annuleren</button>
                  <button onClick={handleUpload} className="px-6 py-2 bg-[#00b8d9] text-[#080d14] rounded-md font-semibold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,184,217,0.4)]">
                    <Zap className="w-4 h-4" />Start AI Scan
                  </button>
                </div>
              )}
            </div>
          )}

          {(scanStatus === 'uploading' || scanStatus === 'analyzing' || scanStatus === 'extracting') && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                <Loader2 className="w-5 h-5 text-[#00b8d9] animate-spin" />
                <Brain className="w-5 h-5 text-[#00b8d9]" />
                <span className="text-[#00b8d9] font-medium">{getStatusText()}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <p className="text-destructive">{error}</p>
            </div>
          )}
        </div>

        {transactions.length > 0 && (
          <div className="grid gap-6">
            {/* Export Section */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-[#00b8d9]" />Exporteer je data
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[['excel','Excel',FileSpreadsheet], ['mt940','MT940',Database], ['csv','CSV',Table], ['camt','CAMT.053',FileCode]].map(([k,l,Icon]: any) => (
                  <button key={k} onClick={() => setSelectedExport(k)} className={`flex flex-col items-center gap-2 p-4 rounded-lg cursor-pointer transition-all ${selectedExport === k ? 'bg-cyan-500/15 border-2 border-[#00b8d9]' : 'bg-background border border-border hover:border-[#00b8d9]/50'}`}>
                    <Icon className="w-8 h-8 text-[#00b8d9]" />
                    <span className="text-sm font-medium text-foreground">{l}</span>
                  </button>
                ))}
              </div>
              {selectedExport === 'camt' && (
                <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <p className="text-sm text-[#00b8d9]">✓ Nieuwe standaard - vervangt MT940</p>
                  <p className="text-sm text-muted-foreground">Werkt met alle NL boekhoudpakketten</p>
                </div>
              )}
              <button onClick={handleExport} disabled={exportLoading} className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${exportLoading ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-[#00b8d9] text-[#080d14] hover:shadow-[0_0_20px_rgba(0,184,217,0.4)]'}`}>
                {exportLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Bezig...</> : <><Download className="w-5 h-5" />Download {selectedExport.toUpperCase()}</>}
              </button>
            </div>

            {/* BTW Summary */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#00b8d9]" />📊 BTW Aangifte Klaar
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="bg-background border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Rubriek 1a (21%)</p>
                  <p className="text-xl font-semibold text-foreground">€{btw21.toFixed(2)}</p>
                </div>
                <div className="bg-background border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Rubriek 1b (9%)</p>
                  <p className="text-xl font-semibold text-foreground">€{btw9.toFixed(2)}</p>
                </div>
                <div className="bg-background border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Rubriek 1d (0%)</p>
                  <p className="text-xl font-semibold text-foreground">€{btw0.toFixed(2)}</p>
                </div>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Te betalen BTW</p>
                  <p className="text-3xl font-bold text-[#00b8d9]">€{totalBtw.toFixed(2)}</p>
                </div>
                <button className="px-5 py-2.5 bg-[#00b8d9] text-[#080d14] rounded-md font-semibold">Kopieer</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
