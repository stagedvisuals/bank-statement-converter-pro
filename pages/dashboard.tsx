import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { FileText, Upload, Download, Zap, AlertTriangle, LogOut, Loader2, Brain, FileSpreadsheet, Database, FileCode, Table, History, Settings, LayoutDashboard, Calculator, Sun, Moon, Shield, ShieldAlert, ShieldCheck, Lock, Globe, Crown } from 'lucide-react';
import { Logo } from '../components/Logo';
import SmartRulesManager from '../components/SmartRulesManager';
import DashboardSmartTools from '../components/DashboardSmartTools';
import OnboardingTracker from '../components/OnboardingTracker';
import EmptyState from '../components/EmptyState';
import { detectBTW, TrustLevel } from '@/lib/btw-detection';

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
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [credits, setCredits] = useState<number>(0);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [scannedData, setScannedData] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  
  // Session timeout voor beveiliging (30 minuten inactiviteit)
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minuten
  const WARNING_TIME = 2 * 60 * 1000; // Waarschuwing 2 minuten van tevoren
  
  useEffect(() => {
    const session = localStorage.getItem('bscpro_session');
    const userData = localStorage.getItem('bscpro_user');
    if (!session) { router.push('/login'); return; }
    if (userData) setUser(JSON.parse(userData));
    fetchCredits();
    
    // Inactiviteit tracker
    let inactivityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;
    
    const resetTimers = () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      setShowTimeoutWarning(false);
      
      // Waarschuwing na INACTIVITY_TIMEOUT - WARNING_TIME
      warningTimer = setTimeout(() => {
        setShowTimeoutWarning(true);
      }, INACTIVITY_TIMEOUT - WARNING_TIME);
      
      // Logout na INACTIVITY_TIMEOUT
      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };
    
    // Event listeners voor gebruikersactiviteit
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, resetTimers);
    });
    
    // Start timers
    resetTimers();
    
    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimers);
      });
    };
  }, [router]);

  // Load scan history on mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('bscpro_history') || '[]');
    setScanHistory(history);
  }, []);

  const fetchCredits = async () => {
    try {
      const session = localStorage.getItem('bscpro_session');
      if (!session) return;
      const { access_token } = JSON.parse(session);
      const response = await fetch('/api/user/credits', {
        headers: { 'Authorization': `Bearer ${access_token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits?.remaining_credits || 0);
        setOnboardingComplete(data.onboarding?.progress_percentage === 100);
        setUserPlan(data.plan || 'free');
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const useCredit = async () => {
    try {
      const session = localStorage.getItem('bscpro_session');
      if (!session) return false;
      const { access_token } = JSON.parse(session);
      const response = await fetch('/api/user/use-credit', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${access_token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCredits(data.remaining_credits);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error using credit:', error);
      return false;
    }
  };

  const completeOnboardingStep = async (step: string) => {
    try {
      const session = localStorage.getItem('bscpro_session');
      if (!session) return;
      const { access_token } = JSON.parse(session);
      await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ step })
      });
    } catch (error) {
      console.error('Error completing onboarding step:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) { 
      setFile(e.target.files[0]); 
      setError(''); 
    }
  };

  const handleUpload = async () => {
    if (!file) { setError('Selecteer eerst een bestand'); return; }
    
    const creditUsed = await useCredit();
    if (!creditUsed) {
      setError('Geen credits beschikbaar. Upgrade je abonnement om door te gaan.');
      return;
    }
    
    await completeOnboardingStep('first_upload');
    
    setScanStatus('uploading');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/convert', { method: 'POST', body: formData });
      setScanStatus('analyzing');
      await new Promise(r => setTimeout(r, 500));
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Upload mislukt'); }
      const data = await response.json();
      const transactions = data.data?.transacties || data.transactions || []
      if (!data.success || !transactions.length) throw new Error(data.error || 'Geen transacties gevonden')
      setScanStatus('extracting');
      await new Promise(r => setTimeout(r, 500));
      setTransactions(transactions);
      setBank(data.bank || 'Onbekend');
      setRekeningnummer(data.rekeningnummer || '');
      setCategorySummary(data.categorySummary || []);
      
      // Save scanned data for preview
      const scanData = data.data || data;
      setScannedData(scanData);
      
      // Save to scan history
      const historyItem = {
        id: Date.now(),
        bank: scanData.bank || 'Onbekend',
        transacties: scanData.transacties?.length || 0,
        datum: new Date().toLocaleDateString('nl-NL'),
        rekeninghouder: scanData.rekeninghouder || 'Onbekend',
        data: scanData
      };
      const history = JSON.parse(localStorage.getItem('bscpro_history') || '[]');
      history.unshift(historyItem);
      localStorage.setItem('bscpro_history', JSON.stringify(history.slice(0, 5)));
      setScanHistory(history.slice(0, 5));
      
      setScanStatus('done');
    } catch (err: any) {
      // Toon gebruiksvriendelijke foutmelding
      const errorMessage = err.message || 'Er is iets misgegaan';
      setError(errorMessage);
      setScanStatus('error');
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      // QBO is verwijderd - alleen via Enterprise modal beschikbaar
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
      await completeOnboardingStep('first_export');
    } catch (err: any) { setError('Export mislukt: ' + err.message); }
    finally { setExportLoading(false); }
  };

  const handleLogout = () => { 
    localStorage.removeItem('bscpro_session'); 
    localStorage.removeItem('bscpro_user'); 
    router.push('/login'); 
  };

  const getStatusText = () => { 
    const m: any = { uploading: 'Document wordt geüpload...', analyzing: 'AI analyseert document-layout...', extracting: 'Data wordt gevalideerd...', done: 'Klaar!', error: 'Fout opgetreden' }; 
    return m[scanStatus] || ''; 
  };

  // Bereken BTW met Trust Score analyse
  const transactionsWithTrust = transactions.map(t => {
    const btwResult = detectBTW(t.tegenpartij || t.omschrijving || '', t.omschrijving || '');
    return { ...t, btwResult };
  });
  
  const highTrustCount = transactionsWithTrust.filter(t => t.btwResult.trustScore.level === 'high').length;
  const mediumTrustCount = transactionsWithTrust.filter(t => t.btwResult.trustScore.level === 'medium').length;
  const lowTrustCount = transactionsWithTrust.filter(t => t.btwResult.trustScore.level === 'low').length;
  
  const btw21 = transactionsWithTrust
    .filter(t => t.btwResult.tarief === 21)
    .reduce((sum, t) => sum + (t.bedrag * 0.21), 0);
  const btw9 = transactionsWithTrust
    .filter(t => t.btwResult.tarief === 9)
    .reduce((sum, t) => sum + (t.bedrag * 0.09), 0);
  const btw0 = transactionsWithTrust
    .filter(t => t.btwResult.tarief === 0)
    .reduce((sum, t) => sum + t.bedrag, 0);
  const totalBtw = btw21 + btw9;

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 text-[#00b8d9] animate-spin" />
    </div>
  );

  const showEmptyState = transactions.length === 0 && scanStatus === 'idle' && !file;

  return (
    <div className="min-h-screen bg-background">
      <Head><title>Dashboard - BSC Pro</title></Head>
      
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

        <OnboardingTracker />

        <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold md:text-2xl">Dashboard</h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Converteer je bankafschriften naar Excel, CSV of MT940
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Plan Badge */}
            {(() => {
              const planConfig: Record<string, {label: string, color: string, emoji: string}> = {
                'free': { label: 'Free', color: 'bg-muted text-muted-foreground border-border', emoji: '🆓' },
                'starter': { label: 'Starter', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', emoji: '⭐' },
                'pro': { label: 'Pro', color: 'bg-[#00b8d9]/20 text-[#00b8d9] border-[#00b8d9]/30', emoji: '🚀' },
                'business': { label: 'Business', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', emoji: '💼' },
                'enterprise': { label: 'Enterprise', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', emoji: '👑' },
              };
              const config = planConfig[userPlan] || planConfig.free;
              return (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium ${config.color}`}>
                  <span>{config.emoji}</span>
                  <span>{config.label}</span>
                </div>
              );
            })()}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
              credits > 0 ? 'bg-[#00b8d9]/10 border-[#00b8d9]/30' : 'bg-destructive/10 border-destructive/30'
            }`}>
              <span className="text-lg">{credits > 0 ? '✅' : '❌'}</span>
              <div>
                <p className="text-xs text-muted-foreground">Credits</p>
                <p className={`font-bold text-sm ${credits > 0 ? 'text-[#00b8d9]' : 'text-destructive'}`}>
                  {credits} beschikbaar
                </p>
              </div>
            </div>
            {credits === 0 && (
              <Link href="/#pricing" className="px-4 py-2 bg-[#00b8d9] text-[#080d14] rounded-xl text-sm font-bold hover:bg-[#00a8c9] transition-colors">
                ⬆️ Upgrade
              </Link>
            )}
          </div>
        </div>
        {/* Welkomst banner voor nieuwe gebruikers */}
        {credits > 0 && credits <= 2 && transactions.length === 0 && (
          <div className="mb-6 p-6 bg-gradient-to-r from-[#00b8d9]/10 to-[#0088aa]/10 border border-[#00b8d9]/30 rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  👋 Welkom bij BSCPro!
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Je hebt <strong>2 gratis conversies</strong> om BSCPro te proberen. Zo werkt het:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium text-sm">1. Upload PDF</p>
                      <p className="text-xs text-muted-foreground">
                        Sleep je bankafschrift naar het upload veld
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <p className="font-medium text-sm">2. AI verwerkt</p>
                      <p className="text-xs text-muted-foreground">
                        Onze AI herkent alle transacties automatisch
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <p className="font-medium text-sm">3. Download Excel</p>
                      <p className="text-xs text-muted-foreground">
                        Kies je formaat: Excel, CSV, MT940 of CAMT.053
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a href="#upload" className="px-4 py-2 bg-[#00b8d9] text-[#080d14] rounded-lg text-sm font-bold hover:bg-[#00a8c9] transition-colors">
                    🚀 Start je eerste conversie
                  </a>
                  <a href="/#pricing" className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors">
                    Bekijk plannen
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEmptyState ? (
          <EmptyState onFileSelect={(selectedFile) => { setFile(selectedFile); setError(''); }} credits={credits} />
        ) : (
          <>
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
                      <button onClick={() => setFile(null)} className="px-4 py-3 text-muted-foreground border border-border rounded-md hover:text-foreground min-h-[44px]">Annuleren</button>
                      <button onClick={handleUpload} className="px-6 py-3 bg-[#00b8d9] text-[#080d14] rounded-md font-semibold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,184,217,0.4)] min-h-[44px]">
                        <Zap className="w-4 h-4" />Start AI Scan
                      </button>
                    </div>
                  )}
                </div>
              )}

              {(scanStatus === 'uploading' || scanStatus === 'analyzing' || scanStatus === 'extracting') && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-full animate-pulse">
                    <Loader2 className="w-5 h-5 text-[#00b8d9] animate-spin" />
                    <Brain className="w-5 h-5 text-[#00b8d9]" />
                    <span className="text-[#00b8d9] font-medium">{getStatusText()}</span>
                  </div>
                  <div className="mt-4 flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00b8d9] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#00b8d9] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#00b8d9] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}

              {scanStatus === 'done' && scannedData && (
              <div className="mt-6 space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-xl md:text-2xl font-bold text-[#00b8d9]">
                      {scannedData.transacties?.length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Transacties</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-500">
                      €{scannedData.transacties?.filter((t: any) => t.bedrag > 0).reduce((sum: number, t: any) => sum + t.bedrag, 0).toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Inkomsten</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-destructive">
                      €{Math.abs(scannedData.transacties?.filter((t: any) => t.bedrag < 0).reduce((sum: number, t: any) => sum + t.bedrag, 0) || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Uitgaven</p>
                  </div>
                </div>

                {/* Bank Info */}
                <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl text-sm flex-wrap">
                  <span>🏦 <strong>{scannedData.bank}</strong></span>
                  <span>👤 {scannedData.rekeninghouder}</span>
                  <span>📅 {scannedData.periode?.van} → {scannedData.periode?.tot}</span>
                </div>

                {/* Transaction Table */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-medium">📋 Transacties</h3>
                    <span className="text-xs text-muted-foreground">
                      Eerste 10 van {scannedData.transacties?.length}
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-left p-3">Datum</th>
                          <th className="text-left p-3">Omschrijving</th>
                          <th className="text-right p-3">Bedrag</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scannedData.transacties?.slice(0, 10).map((t: any, i: number) => (
                          <tr key={i} className="border-t border-border hover:bg-muted/20">
                            <td className="p-3 text-muted-foreground whitespace-nowrap">{t.datum}</td>
                            <td className="p-3 truncate max-w-[120px] md:max-w-[200px]">{t.omschrijving}</td>
                            <td className={`p-3 text-right font-medium whitespace-nowrap ${t.bedrag >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                              {t.bedrag >= 0 ? '+' : ''}€{t.bedrag?.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Download Section */}
                <div className="p-4 bg-[#00b8d9]/10 border border-[#00b8d9]/30 rounded-xl">
                  <p className="text-sm font-medium mb-3">
                    ✅ Ziet dit er goed uit? Download je bestand:
                  </p>
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

            {/* Scan History */}
            {scanHistory.length > 0 && scanStatus === 'idle' && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  📂 Recente conversies
                </h3>
                <div className="space-y-2">
                  {scanHistory.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:bg-muted/20 cursor-pointer transition-colors"
                      onClick={() => {
                        setScannedData(item.data);
                        setBank(item.data.bank || 'Onbekend');
                        setTransactions(item.data.transacties || []);
                        setScanStatus('done');
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📄</span>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px] md:max-w-none">{item.bank} - {item.rekeninghouder}</p>
                          <p className="text-xs text-muted-foreground">{item.datum} · {item.transacties} transacties</p>
                        </div>
                      </div>
                      <span className="text-xs text-[#00b8d9]">Opnieuw bekijken →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {transactions.length > 0 && (
              <div className="grid gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-[#00b8d9]" />Exporteer je data
                  </h3>
                  {/* Standaard exports - NL Boekhoudpakketten */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-4">
                    {/* Excel - Universeel */}
                    <button 
                      onClick={() => setSelectedExport('excel')} 
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg cursor-pointer transition-all ${selectedExport === 'excel' ? 'bg-cyan-500/15 border-2 border-[#00b8d9]' : 'bg-background border border-border hover:border-[#00b8d9]/50'}`}
                    >
                      <FileSpreadsheet className="w-8 h-8 text-[#00b8d9]" />
                      <span className="text-sm font-medium text-foreground">Excel (.xlsx)</span>
                      <span className="text-xs text-muted-foreground">Universeel</span>
                    </button>
                    
                    {/* Moneybird - Branded */}
                    <button 
                      onClick={() => setSelectedExport('camt')} 
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg cursor-pointer transition-all group ${selectedExport === 'camt' ? 'bg-[#21a03c]/15 border-2 border-[#21a03c]' : 'bg-background border border-border hover:border-[#21a03c]/50'}`}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#21a03c' }}>
                        <FileCode className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Export voor Moneybird</span>
                      <span className="text-xs font-medium" style={{ color: '#21a03c' }}>Compatibel (.xml)</span>
                    </button>
                    
                    {/* Exact Online - Branded */}
                    <button 
                      onClick={() => setSelectedExport('camt')} 
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg cursor-pointer transition-all ${selectedExport === 'camt' ? 'bg-[#ed1c24]/15 border-2 border-[#ed1c24]' : 'bg-background border border-border hover:border-[#ed1c24]/50'}`}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ed1c24' }}>
                        <FileCode className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Export voor Exact Online</span>
                      <span className="text-xs font-medium" style={{ color: '#ed1c24' }}>Compatibel (.xml)</span>
                    </button>
                  </div>
                  
                  {/* Legacy formaten */}
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3 mb-4">
                    <button 
                      onClick={() => setSelectedExport('mt940')} 
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${selectedExport === 'mt940' ? 'bg-cyan-500/15 border-2 border-[#00b8d9]' : 'bg-background border border-border hover:border-[#00b8d9]/50'}`}
                    >
                      <Database className="w-6 h-6 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">MT940</span>
                      <span className="text-xs text-muted-foreground">Legacy</span>
                    </button>
                    
                    <button 
                      onClick={() => setSelectedExport('csv')} 
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${selectedExport === 'csv' ? 'bg-cyan-500/15 border-2 border-[#00b8d9]' : 'bg-background border border-border hover:border-[#00b8d9]/50'}`}
                    >
                      <Table className="w-6 h-6 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">CSV</span>
                      <span className="text-xs text-muted-foreground">Import</span>
                    </button>
                  </div>
                  
                  {/* Enterprise QBO Export - Met Lock */}
                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Enterprise Features</p>
                    <button 
                      onClick={() => setShowEnterpriseModal(true)} 
                      className="w-full flex items-center justify-between p-4 rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-purple-500/5 hover:from-amber-500/10 hover:to-purple-500/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-500 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-foreground flex items-center gap-2">
                            Export Internationaal (.QBO)
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                          </p>
                          <p className="text-xs text-muted-foreground">QuickBooks Online, Xero, internationale boekhouding</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30">
                        <Crown className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-medium text-amber-600">Enterprise</span>
                      </div>
                    </button>
                  </div>
                  
                  {selectedExport === 'camt' && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-orange-500/10 border border-cyan-500/20 rounded-lg">
                      <p className="text-sm text-[#00b8d9] font-medium">✓ CAMT.053 XML Formaat</p>
                      <p className="text-sm text-muted-foreground">Werkt met Moneybird, Exact Online, Twinfield, SnelStart en alle moderne pakketten</p>
                    </div>
                  )}
                  
                  <button onClick={handleExport} disabled={exportLoading} className={`w-full mt-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 relative overflow-hidden ${exportLoading ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-[#00b8d9] text-[#080d14] hover:shadow-[0_0_20px_rgba(0,184,217,0.4)]'}`}>
                    {exportLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Genereren {selectedExport.toUpperCase()}...</span>
                        <div className="absolute bottom-0 left-0 h-1 bg-[#00b8d9]/30 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '100%' }}>
                          <div className="h-full bg-[#00b8d9] animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '30%' }}></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download {selectedExport.toUpperCase()}</span>
                      </>
                    )}
                  </button>
                  
                  {/* Juridische Disclaimer */}
                  <p className="mt-3 text-[10px] text-muted-foreground text-center leading-tight">
                    BSC Pro is een onafhankelijke dienst en is op geen enkele wijze gelieerd aan, gesponsord door, of goedgekeurd door Moneybird of Exact. 
                    Alle merknamen en logo's zijn eigendom van hun respectieve eigenaren. De exportfunctie genereert standaard CAMT.053 XML-bestanden die 
                    compatibel zijn met deze boekhoudpakketten. "Export voor" impliceert bestandscompatibiliteit, geen officiële integratie of partnership.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#00b8d9]" />📊 AI BTW Analyse
                  </h3>
                  
                  {/* Trust Score Dashboard */}
                  <div className="mb-5 p-4 bg-background border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground">Betrouwbaarheid classificaties</span>
                      <span className="text-xs text-muted-foreground">{Math.round((highTrustCount / transactions.length) * 100)}% geautomatiseerd</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 p-2 bg-emerald-500/10 rounded-lg">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Zeker</p>
                          <p className="text-lg font-semibold text-emerald-600">{highTrustCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-lg">
                        <Shield className="w-4 h-4 text-amber-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Check</p>
                          <p className="text-lg font-semibold text-amber-600">{mediumTrustCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg">
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Controle</p>
                          <p className="text-lg font-semibold text-red-600">{lowTrustCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* BTW Overzicht */}
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
                  
                  <p className="mt-3 text-xs text-muted-foreground text-center">
                    ⚠️ Controleer transacties met 🟡 en 🔴 status voordat je de BTW aangifte indient
                  </p>
                </div>

                <SmartRulesManager />
                <DashboardSmartTools />
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Enterprise Modal - QBO Export Paywall */}
      {showEnterpriseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-purple-500 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Internationale Export (QBO)</h3>
                  <p className="text-xs text-amber-500 font-medium">Enterprise Feature</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEnterpriseModal(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <span className="text-muted-foreground">✕</span>
              </button>
            </div>
            
            {/* Content */}
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                Exporteer direct naar <strong className="text-foreground">QuickBooks Online</strong>. 
                Deze premium functie is onderdeel van ons aankomende Enterprise pakket (€99/mnd), 
                speciaal voor e-commerce en internationale handel.
              </p>
              
              {/* Features list */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Wat krijg je:</p>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-[#00b8d9]" />
                  <span>QuickBooks Online integratie</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileCode className="w-4 h-4 text-[#00b8d9]" />
                  <span>Xero, Sage & meer formaten</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-[#00b8d9]" />
                  <span>Prioriteit support & API toegang</span>
                </div>
              </div>
              
              {/* Waitlist form */}
              {!waitlistSubmitted ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Laat je e-mail achter en we sturen je een bericht zodra Enterprise beschikbaar is.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="jouw@email.nl"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-[#00b8d9]"
                    />
                    <button
                      onClick={() => {
                        if (waitlistEmail.includes('@')) {
                          setWaitlistSubmitted(true);
                          // Hier later: API call naar wachtlijst
                          console.log('Waitlist signup:', waitlistEmail);
                        }
                      }}
                      disabled={!waitlistEmail.includes('@')}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-purple-500 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Inschrijven
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
                  <p className="text-emerald-600 font-medium">✓ Je staat op de wachtlijst!</p>
                  <p className="text-xs text-muted-foreground mt-1">We sturen je een e-mail zodra Enterprise live gaat.</p>
                </div>
              )}
              
              {/* Footer */}
              <p className="text-xs text-muted-foreground text-center">
                Verwachte lancering: Q2 2025
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Session Timeout Warning */}
      {showTimeoutWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-destructive/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Sessie verloopt bijna</h3>
                <p className="text-xs text-muted-foreground">Veiligheidstimeout</p>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              Je wordt over <strong className="text-foreground">2 minuten</strong> automatisch uitgelogd 
              vanwege inactiviteit. Klik op een willekeurige plek om je sessie te verlengen.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowTimeoutWarning(false)}
                className="flex-1 py-2.5 bg-[#00b8d9] text-[#080d14] rounded-lg font-medium hover:shadow-[0_0_20px_rgba(0,184,217,0.4)] transition-all"
              >
                Sessie verlengen
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2.5 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
