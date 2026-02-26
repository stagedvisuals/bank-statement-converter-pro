import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { FileText, Upload, Download, Zap, AlertTriangle, LogOut, Loader2, Brain, FileSpreadsheet, Database, FileCode, Table, History, Settings, LayoutDashboard, Calculator, Lightbulb, CheckCircle2, Calendar, Sun, Moon } from 'lucide-react';
import { DynamicLogo } from '../components/DynamicLogo';

// Theme Toggle Component
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ width: '40px', height: '40px' }} />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        border: '1px solid rgba(0, 184, 217, 0.3)',
        background: isDark ? 'rgba(0, 184, 217, 0.1)' : 'rgba(0, 184, 217, 0.05)',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      title={isDark ? 'Schakel naar licht thema' : 'Schakel naar donker thema'}
    >
      {isDark ? (
        <Sun style={{ width: '20px', height: '20px', color: '#00b8d9' }} />
      ) : (
        <Moon style={{ width: '20px', height: '20px', color: '#00b8d9' }} />
      )}
    </button>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
    const session = localStorage.getItem('bscpro_session');
    const userData = localStorage.getItem('bscpro_user');
    if (!session) { router.push('/login'); return; }
    if (userData) setUser(JSON.parse(userData));
  }, [router]);

  const isDark = mounted ? theme === 'dark' : true;

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

  // Theme-based styles
  const bgColor = isDark ? '#080d14' : '#f8fafc';
  const cardBg = isDark ? 'rgba(10, 18, 32, 0.8)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(0, 184, 217, 0.15)' : '#e2e8f0';
  const textColor = isDark ? '#e8edf5' : '#0f172a';
  const textMuted = isDark ? '#6b7fa3' : '#64748b';
  const navBg = isDark ? 'rgba(8, 13, 20, 0.95)' : 'rgba(255, 255, 255, 0.95)';

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bgColor, color: '#00b8d9' }}>
      <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: bgColor, transition: 'background-color 0.3s ease' }}>
      <Head><title>Dashboard - BSC Pro</title></Head>
      
      {/* Navigation with Dynamic Logo and Theme Toggle */}
      <nav style={{ 
        background: navBg, 
        backdropFilter: 'blur(12px)', 
        borderBottom: `1px solid ${cardBorder}`, 
        padding: '0 24px', 
        height: '72px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <DynamicLogo />
          <div style={{ display: 'flex', gap: '4px' }}>
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', color: '#00b8d9', background: 'rgba(0, 184, 217, 0.15)', borderRadius: '6px', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
              <LayoutDashboard style={{ width: '16px', height: '16px' }} />Dashboard
            </Link>
            <Link href="/tools/btw-calculator" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', color: textMuted, fontSize: '14px', textDecoration: 'none' }}>
              <Calculator style={{ width: '16px', height: '16px' }} />Tools
            </Link>
            <Link href="/history" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', color: textMuted, fontSize: '14px', textDecoration: 'none' }}>
              <History style={{ width: '16px', height: '16px' }} />Geschiedenis
            </Link>
            <Link href="/onboarding" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', color: textMuted, fontSize: '14px', textDecoration: 'none' }}>
              <Settings style={{ width: '16px', height: '16px' }} />Instellingen
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: textMuted, fontSize: '14px' }}>{user?.email}</span>
          <ThemeToggle />
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: textMuted, background: 'transparent', border: '1px solid rgba(0, 184, 217, 0.3)', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px' }}>
            <LogOut style={{ width: '16px', height: '16px' }} />Uitloggen
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 48px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: textColor, marginBottom: '8px' }}>AI Document Scanner</h1>
          <p style={{ color: textMuted }}>Upload je bankafschrift of factuur. De AI leest automatisch alle transacties.</p>
        </div>

        {/* Upload Section */}
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '32px', marginBottom: '32px', color: textColor }}>
          {!file ? (
            <div style={{ border: `2px dashed ${cardBorder}`, borderRadius: '12px', padding: '48px', textAlign: 'center', cursor: 'pointer' }}>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} style={{ display: 'none' }} id="file-upload" />
              <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                <Upload style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#00b8d9' }} />
                <p style={{ fontSize: '18px', fontWeight: 500, color: textColor, marginBottom: '8px' }}>Klik om document te uploaden</p>
                <p style={{ fontSize: '14px', color: textMuted }}>PDF, JPG, of PNG (max 10MB)</p>
              </label>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isDark ? 'rgba(10, 18, 32, 0.9)' : '#f1f5f9', border: `1px solid ${cardBorder}`, padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText style={{ width: '32px', height: '32px', color: '#00b8d9' }} />
                <div>
                  <p style={{ fontWeight: 500, color: textColor }}>{file.name}</p>
                  <p style={{ fontSize: '14px', color: textMuted }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {scanStatus === 'idle' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setFile(null)} style={{ padding: '8px 16px', color: textMuted, background: 'transparent', border: `1px solid ${cardBorder}`, borderRadius: '6px', cursor: 'pointer' }}>Annuleren</button>
                  <button onClick={handleUpload} style={{ padding: '8px 24px', background: '#00b8d9', color: '#080d14', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap style={{ width: '16px', height: '16px' }} />Start AI Scan
                  </button>
                </div>
              )}
            </div>
          )}

          {(scanStatus === 'uploading' || scanStatus === 'analyzing' || scanStatus === 'extracting') && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '12px 24px', background: 'rgba(0, 184, 217, 0.1)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '999px' }}>
                <Loader2 style={{ width: '20px', height: '20px', color: '#00b8d9', animation: 'spin 1s linear infinite' }} />
                <Brain style={{ width: '20px', height: '20px', color: '#00b8d9' }} />
                <span style={{ color: '#00b8d9', fontWeight: 500 }}>{getStatusText()}</span>
              </div>
            </div>
          )}

          {error && (
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle style={{ width: '20px', height: '20px', color: '#ef4444' }} />
              <p style={{ color: '#ef4444' }}>{error}</p>
            </div>
          )}
        </div>

        {transactions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Export Section */}
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '24px', color: textColor }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download style={{ width: '20px', height: '20px', color: '#00b8d9' }} />Exporteer je data
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {[{k:'excel',l:'Excel',i:FileSpreadsheet},{k:'mt940',l:'MT940',i:Database},{k:'csv',l:'CSV',i:Table},{k:'camt',l:'CAMT.053',i:FileCode}].map(({k,l,i:Icon}) => (
                  <button key={k} onClick={() => setSelectedExport(k as any)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px', background: selectedExport === k ? 'rgba(0, 184, 217, 0.15)' : isDark ? 'rgba(0, 184, 217, 0.08)' : '#f1f5f9', border: selectedExport === k ? '2px solid #00b8d9' : `1px solid ${cardBorder}`, borderRadius: '8px', cursor: 'pointer', color: textColor }}>
                    <Icon style={{ width: '32px', height: '32px', color: '#00b8d9' }} />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{l}</span>
                  </button>
                ))}
              </div>
              {selectedExport === 'camt' && (
                <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(0, 184, 217, 0.1)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '13px', color: '#00b8d9', marginBottom: '4px' }}>✓ Nieuwe standaard - vervangt MT940</p>
                  <p style={{ fontSize: '13px', color: textMuted }}>Werkt met alle NL boekhoudpakketten</p>
                </div>
              )}
              <button onClick={handleExport} disabled={exportLoading} style={{ width: '100%', padding: '12px 24px', background: exportLoading ? 'rgba(0, 184, 217, 0.5)' : '#00b8d9', color: '#080d14', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: exportLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {exportLoading ? <><Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />Bezig...</> : <><Download style={{ width: '18px', height: '18px' }} />Download {selectedExport.toUpperCase()}</>}
              </button>
            </div>

            {/* BTW Summary */}
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '24px', color: textColor }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calculator style={{ width: '20px', height: '20px', color: '#00b8d9' }} />📊 BTW Aangifte Klaar
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: isDark ? 'rgba(10, 18, 32, 0.9)' : '#f8fafc', border: `1px solid ${cardBorder}`, borderRadius: '8px', padding: '16px' }}>
                  <p style={{ fontSize: '13px', color: textMuted, marginBottom: '4px' }}>Rubriek 1a (21%)</p>
                  <p style={{ fontSize: '20px', fontWeight: 600, color: textColor }}>€{btw21.toFixed(2)}</p>
                </div>
                <div style={{ background: isDark ? 'rgba(10, 18, 32, 0.9)' : '#f8fafc', border: `1px solid ${cardBorder}`, borderRadius: '8px', padding: '16px' }}>
                  <p style={{ fontSize: '13px', color: textMuted, marginBottom: '4px' }}>Rubriek 1b (9%)</p>
                  <p style={{ fontSize: '20px', fontWeight: 600, color: textColor }}>€{btw9.toFixed(2)}</p>
                </div>
                <div style={{ background: isDark ? 'rgba(10, 18, 32, 0.9)' : '#f8fafc', border: `1px solid ${cardBorder}`, borderRadius: '8px', padding: '16px' }}>
                  <p style={{ fontSize: '13px', color: textMuted, marginBottom: '4px' }}>Rubriek 1d (0%)</p>
                  <p style={{ fontSize: '20px', fontWeight: 600, color: textColor }}>€{btw0.toFixed(2)}</p>
                </div>
              </div>
              <div style={{ background: 'rgba(0, 184, 217, 0.1)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: textMuted, marginBottom: '4px' }}>Te betalen BTW</p>
                  <p style={{ fontSize: '28px', fontWeight: 700, color: '#00b8d9' }}>€{totalBtw.toFixed(2)}</p>
                </div>
                <button style={{ padding: '10px 20px', background: '#00b8d9', color: '#080d14', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Kopieer</button>
              </div>
              <p style={{ marginTop: '12px', fontSize: '13px', color: textMuted }}>Vul deze bedragen in bij je BTW-aangifte op belastingdienst.nl</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
