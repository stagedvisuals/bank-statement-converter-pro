import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FileText, Upload, Download, Zap, AlertTriangle, LogOut, Loader2, Brain, FileSpreadsheet, Database, FileCode, Table, History, Settings, LayoutDashboard, Calculator, Lightbulb, CheckCircle2, Calendar } from 'lucide-react';

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

  if (!user) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080d14', color: '#00b8d9' }}><Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#080d14' }}>
      <Head><title>Dashboard - BSC Pro</title></Head>
      <nav style={{ background: 'rgba(8, 13, 20, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0, 184, 217, 0.15)', padding: '0 24px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/"><img src="/logo.svg" alt="BSC Pro" style={{ height: '40px' }} /></Link>
          <div style={{ display: 'flex', gap: '4px' }}>
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', color: '#00b8d9', background: 'rgba(0, 184, 217, 0.15)', borderRadius: '6px', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}><LayoutDashboard style={{ width: '16px', height: '16px' }} />Dashboard</Link>
            <div style={{ position: 'relative' }}>
              <Link href="/tools/btw-calculator" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', color: '#6b7fa3', fontSize: '14px', textDecoration: 'none' }}><Calculator style={{ width: '16px', height: '16px' }} />Tools</Link>
            </div>
            <Link href="/history" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', color: '#6b7fa3', fontSize: '14px', textDecoration: 'none' }}><History style={{ width: '16px', height: '16px' }} />Geschiedenis</Link>
            <Link href="/onboarding" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', color: '#6b7fa3', fontSize: '14px', textDecoration: 'none' }}><Settings style={{ width: '16px', height: '16px' }} />Instellingen</Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#6b7fa3', fontSize: '14px' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7fa3', background: 'transparent', border: '1px solid rgba(0, 184, 217, 0.3)', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px' }}><LogOut style={{ width: '16px', height: '16px' }} />Uitloggen</button>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 48px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>AI Document Scanner</h1>
          <p style={{ color: '#6b7fa3' }}>Upload je bankafschrift of factuur. De AI leest automatisch alle transacties.</p>
        </div>

        <div style={{ background: 'rgba(10, 18, 32, 0.8)', border: '1px solid rgba(0, 184, 217, 0.15)', borderRadius: '12px', padding: '32px', marginBottom: '32px', color: '#e8edf5' }}>
          {!file ? (
            <div style={{ border: '2px dashed rgba(107, 127, 163, 0.3)', borderRadius: '12px', padding: '48px', textAlign: 'center', cursor: 'pointer' }}>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} style={{ display: 'none' }} id="file-upload" />
              <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                <Upload style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#6b7fa3' }} />
                <p style={{ fontSize: '18px', fontWeight: 500, color: '#e8edf5', marginBottom: '8px' }}>Klik om document te uploaden</p>
                <p style={{ fontSize: '14px', color: '#6b7fa3' }}>PDF, JPG, of PNG (max 10MB)</p>
              </label>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10, 18, 32, 0.9)', border: '1px solid rgba(0, 184, 217, 0.2)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText style={{ width: '32px', height: '32px', color: '#00b8d9' }} />
                <div><p style={{ fontWeight: 500, color: '#e8edf5' }}>{file.name}</p><p style={{ fontSize: '14px', color: '#6b7fa3' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p></div>
              </div>
              {scanStatus === 'idle' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setFile(null)} style={{ padding: '8px 16px', color: '#6b7fa3', background: 'transparent', border: '1px solid rgba(107, 127, 163, 0.3)', borderRadius: '6px', cursor: 'pointer' }}>Annuleren</button>
                  <button onClick={handleUpload} style={{ padding: '8px 24px', background: '#00b8d9', color: '#080d14', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Zap style={{ width: '16px', height: '16px' }} />Start AI Scan</button>
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

          {error && <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}><AlertTriangle style={{ width: '20px', height: '20px', color: '#ef4444' }} /><p style={{ color: '#ef4444' }}>{error}</p></div>}
        </div>

        {transactions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Categorisatie Sectie met Progress Bars */}
            {categorySummary.length > 0 && (
              <div style={{ background: 'rgba(10, 18, 32, 0.8)', border: '1px solid rgba(0, 184, 217, 0.15)', borderRadius: '12px', padding: '24px', color: '#e8edf5' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#e8edf5' }}>🏷 Categorisatie</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categorySummary.map((cat: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{cat.category?.emoji || '📦'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#e8edf5', fontSize: '14px' }}>{cat.category?.name || cat.categoryName}</span>
                          <span style={{ color: '#6b7fa3', fontSize: '13px' }}>{cat.percentage || Math.round((cat.count / transactions.length) * 100)}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(107, 127, 163, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#00b8d9', borderRadius: '4px', width: `${cat.percentage || Math.round((cat.count / transactions.length) * 100)}%`, transition: 'width 0.3s ease' }} />
                        </div>
                      </div>
                      <span style={{ color: '#e8edf5', fontSize: '13px', fontWeight: 500, minWidth: '70px', textAlign: 'right' }}>€{(cat.total || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: '16px', fontSize: '12px', color: '#6b7fa3' }}>✨ Automatisch gecategoriseerd door AI</p>
              </div>
            )}

            <div style={{ background: 'rgba(10, 18, 32, 0.9)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '12px', padding: '24px', color: '#e8edf5' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#e8edf5', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Download style={{ width: '20px', height: '20px', color: '#00b8d9' }} />Exporteer je data</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {[{k:'excel',l:'Excel',i:FileSpreadsheet},{k:'mt940',l:'MT940',i:Database},{k:'csv',l:'CSV',i:Table},{k:'camt',l:'CAMT.053',i:FileCode}].map(({k,l,i:Icon}) => (
                  <button key={k} onClick={() => setSelectedExport(k as any)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px', background: selectedExport === k ? 'rgba(0, 184, 217, 0.15)' : 'rgba(0, 184, 217, 0.08)', border: selectedExport === k ? '2px solid #00b8d9' : '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '8px', cursor: 'pointer', color: '#e8edf5' }}>
                    <Icon style={{ width: '32px', height: '32px', color: '#00b8d9' }} /><span style={{ fontSize: '14px', fontWeight: 500 }}>{l}</span>
                  </button>
                ))}
              </div>
              {selectedExport === 'camt' && <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(0, 184, 217, 0.1)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '8px' }}><p style={{ fontSize: '13px', color: '#00b8d9', marginBottom: '4px' }}>✓ Nieuwe standaard - vervangt MT940</p><p style={{ fontSize: '13px', color: '#6b7fa3' }}>Werkt met alle NL boekhoudpakketten</p></div>}
              <button onClick={handleExport} disabled={exportLoading} style={{ width: '100%', padding: '12px 24px', background: exportLoading ? 'rgba(0, 184, 217, 0.5)' : '#00b8d9', color: '#080d14', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: exportLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {exportLoading ? <><Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />Bezig...</> : <><Download style={{ width: '18px', height: '18px' }} />Download {selectedExport.toUpperCase()}</>}
              </button>
              <p style={{ marginTop: '12px', fontSize: '13px', color: '#6b7fa3', textAlign: 'center' }}>💡 <strong>Tip:</strong> Gebruik MT940 of CAMT.053 voor directe import in Exact, Twinfield, AFAS of SnelStart</p>
            </div>

            {/* BTW Summary */}
            <div style={{ background: 'rgba(10, 18, 32, 0.8)', border: '1px solid rgba(0, 184, 217, 0.15)', borderRadius: '12px', padding: '24px', color: '#e8edf5' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calculator style={{ width: '20px', height: '20px', color: '#00b8d9' }} />📊 BTW Aangifte Klaar</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(10, 18, 32, 0.9)', border: '1px solid rgba(0, 184, 217, 0.1)', borderRadius: '8px', padding: '16px' }}><p style={{ fontSize: '13px', color: '#6b7fa3', marginBottom: '4px' }}>Rubriek 1a (21%)</p><p style={{ fontSize: '20px', fontWeight: 600 }}>€{btw21.toFixed(2)}</p></div>
                <div style={{ background: 'rgba(10, 18, 32, 0.9)', border: '1px solid rgba(0, 184, 217, 0.1)', borderRadius: '8px', padding: '16px' }}><p style={{ fontSize: '13px', color: '#6b7fa3', marginBottom: '4px' }}>Rubriek 1b (9%)</p><p style={{ fontSize: '20px', fontWeight: 600 }}>€{btw9.toFixed(2)}</p></div>
                <div style={{ background: 'rgba(10, 18, 32, 0.9)', border: '1px solid rgba(0, 184, 217, 0.1)', borderRadius: '8px', padding: '16px' }}><p style={{ fontSize: '13px', color: '#6b7fa3', marginBottom: '4px' }}>Rubriek 1d (0%)</p><p style={{ fontSize: '20px', fontWeight: 600 }}>€{btw0.toFixed(2)}</p></div>
              </div>
              <div style={{ background: 'rgba(0, 184, 217, 0.1)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div><p style={{ fontSize: '14px', color: '#6b7fa3', marginBottom: '4px' }}>Te betalen BTW</p><p style={{ fontSize: '28px', fontWeight: 700, color: '#00b8d9' }}>€{totalBtw.toFixed(2)}</p></div>
                <button style={{ padding: '10px 20px', background: '#00b8d9', color: '#080d14', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Kopieer</button>
              </div>
              <p style={{ marginTop: '12px', fontSize: '13px', color: '#6b7fa3' }}>Vul deze bedragen in bij je BTW-aangifte op belastingdienst.nl</p>
            </div>

            {/* Boekhoudpakket Tip */}
            <div style={{ background: 'rgba(10, 18, 32, 0.8)', border: '1px solid rgba(0, 184, 217, 0.15)', borderRadius: '12px', padding: '24px', color: '#e8edf5' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Lightbulb style={{ width: '20px', height: '20px', color: '#00b8d9' }} />💡 Direct importeren</h3>
              <p style={{ color: '#6b7fa3', marginBottom: '12px' }}>Gebruik MT940 of CAMT.053 voor directe import in:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Exact Online', 'Moneybird', 'e-Boekhouden.nl', 'SnelStart', 'AFAS', 'Twinfield'].map(app => <span key={app} style={{ padding: '6px 12px', background: 'rgba(0, 184, 217, 0.1)', border: '1px solid rgba(0, 184, 217, 0.2)', borderRadius: '999px', fontSize: '13px', color: '#e8edf5' }}>• {app}</span>)}
              </div>
            </div>

            {/* Jaaroverzicht Sectie */}
            <div style={{ background: 'rgba(10, 18, 32, 0.8)', border: '1px solid rgba(0, 184, 217, 0.15)', borderRadius: '12px', padding: '24px', color: '#e8edf5' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar style={{ width: '20px', height: '20px', color: '#00b8d9' }} />
                📅 Combineer tot jaaroverzicht
              </h3>
              <p style={{ color: '#6b7fa3', marginBottom: '16px' }}>
                Je hebt meerdere uploads gedaan. Combineer alle transacties in één jaarexport.
              </p>
              <button style={{ 
                width: '100%', 
                padding: '12px 24px', 
                background: 'rgba(0, 184, 217, 0.1)', 
                border: '1px solid rgba(0, 184, 217, 0.3)', 
                color: '#00b8d9', 
                borderRadius: '8px', 
                fontWeight: 600, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <Calendar style={{ width: '18px', height: '18px' }} />
                Maak jaaroverzicht
              </button>
            </div>

            {/* KvK Badge */}
            {user?.btw_nummer && (
              <div style={{ background: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22, 163, 74, 0.3)', borderRadius: '12px', padding: '16px 24px', color: '#e8edf5', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 style={{ width: '24px', height: '24px', color: '#16a34a' }} />
                <div><p style={{ fontSize: '14px', fontWeight: 500 }}>✅ BTW-nummer geverifieerd</p><p style={{ fontSize: '13px', color: '#6b7fa3' }}>{user.btw_nummer} | {user.bedrijfsnaam || 'Bedrijf'}</p></div>
              </div>
            )}

            {/* Transaction Table */}
            <div style={{ background: 'rgba(10, 18, 32, 0.8)', border: '1px solid rgba(0, 184, 217, 0.15)', borderRadius: '12px', overflow: 'hidden', color: '#e8edf5' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid rgba(0, 184, 217, 0.1)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{transactions.length} Transacties Gevonden</h2>
                <p style={{ color: '#6b7fa3' }}>Bank: {bank}</p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: 'rgba(10, 18, 32, 0.9)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6b7fa3', borderBottom: '1px solid rgba(0, 184, 217, 0.1)' }}>Datum</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6b7fa3', borderBottom: '1px solid rgba(0, 184, 217, 0.1)' }}>Omschrijving</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6b7fa3', borderBottom: '1px solid rgba(0, 184, 217, 0.1)' }}>Categorie</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#6b7fa3', borderBottom: '1px solid rgba(0, 184, 217, 0.1)' }}>Bedrag</th>
                  </tr></thead>
                  <tbody>
                    {transactions.slice(0, 10).map((t, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(10, 18, 32, 0.4)' }}>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 184, 217, 0.05)' }}>{t.datum}</td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 184, 217, 0.05)' }}>{t.omschrijving}</td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 184, 217, 0.05)' }}><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span>{t.categoryEmoji}</span>{t.categoryName}</span></td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 184, 217, 0.05)', textAlign: 'right', color: t.bedrag < 0 ? '#ef4444' : '#16a34a', fontWeight: 500 }}>€{t.bedrag.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {transactions.length > 10 && <p style={{ padding: '16px', textAlign: 'center', color: '#6b7fa3', fontSize: '14px' }}>... en {transactions.length - 10} transacties meer</p>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
