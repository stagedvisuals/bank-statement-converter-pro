import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { 
  FileText, 
  Upload, 
  Download, 
  Zap, 
  CheckCircle,
  AlertTriangle,
  Trash2,
  LogOut,
  Loader2,
  Brain,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Database,
  FileCode,
  Table
} from 'lucide-react';

interface Transaction {
  id: string;
  datum: string;
  omschrijving: string;
  bedrag: number;
  category: string;
  categoryName: string;
  categoryEmoji: string;
  categoryBgColor?: string;
  btw: { rate: number; description: string };
}

interface CategorySummary {
  id: string;
  count: number;
  total: number;
  percentage: string;
  category: {
    name: string;
    emoji: string;
    color: string;
    bgColor: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'extracting' | 'done' | 'error'>('idle');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bank, setBank] = useState<string>('');
  const [rekeningnummer, setRekeningnummer] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);

  useEffect(() => {
    const session = localStorage.getItem('bscpro_session');
    const userData = localStorage.getItem('bscpro_user');
    if (!session) {
      router.push('/login');
      return;
    }
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Selecteer eerst een bestand');
      return;
    }

    setScanStatus('uploading');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/convert/', {
        method: 'POST',
        body: formData
      });

      setScanStatus('analyzing');
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload mislukt');
      }

      const data = await response.json();
      
      if (!data.success || !data.transactions || data.transactions.length === 0) {
        throw new Error(data.error || 'Geen transacties gevonden');
      }

      setScanStatus('extracting');
      await new Promise(resolve => setTimeout(resolve, 500));

      const formatted = data.transactions.map((t: any, index: number) => ({
        id: index.toString(),
        datum: t.datum || '',
        omschrijving: t.omschrijving || 'Onbekend',
        bedrag: parseFloat(t.bedrag) || 0,
        category: t.category || 'overig',
        categoryName: t.categoryName || 'Overig',
        categoryEmoji: t.categoryEmoji || '📦',
        categoryBgColor: t.categoryBgColor || '',
        btw: t.btw || { rate: 21, description: 'Standaard tarief' }
      }));

      setTransactions(formatted);
      setBank(data.bank || 'Onbekend');
      setRekeningnummer(data.rekeningnummer || '');
      setCategorySummary(data.categorySummary || []);
      setScanStatus('done');

    } catch (err: any) {
      setError(err.message);
      setScanStatus('error');
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await fetch('/api/convert/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, bank })
      });

      if (!response.ok) throw new Error('Export mislukt');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BSC-PRO-${bank}-Scan.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Export mislukt: ' + err.message);
    }
  };

  // NEW: MT940 Export
  const exportToMT940 = async () => {
    try {
      const response = await fetch('/api/convert/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, bank, rekeningnummer })
      });

      if (!response.ok) throw new Error('MT940 Export mislukt');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BSC-PRO-${bank}-MT940.sta`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('MT940 Export mislukt: ' + err.message);
    }
  };

  // NEW: CSV Export
  const exportToCSV = () => {
    try {
      const headers = ['Datum', 'Omschrijving', 'Categorie', 'Bedrag'];
      const rows = transactions.map(t => [
        t.datum,
        `"${t.omschrijving}"`,
        t.category,
        t.bedrag.toString()
      ]);
      
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BSC-PRO-${bank}-Export.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('CSV Export mislukt: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bscpro_session');
    localStorage.removeItem('bscpro_user');
    router.push('/login');
  };

  const getStatusText = () => {
    switch (scanStatus) {
      case 'uploading': return 'Document wordt geüpload...';
      case 'analyzing': return 'AI analyseert document-layout...';
      case 'extracting': return 'Data wordt gevalideerd...';
      case 'done': return 'Klaar!';
      case 'error': return 'Fout opgetreden';
      default: return '';
    }
  };

  if (!user) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Laden...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Head>
        <title>Dashboard - BSC Pro</title>
      </Head>

      <nav className="bg-slate-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="BSC Pro" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 text-sm">{user?.email}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-300 hover:text-white">
            <LogOut className="w-4 h-4" />
            Uitloggen
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Document Scanner</h1>
          <p className="text-slate-600">Upload je bankafschrift of factuur. De AI leest automatisch alle transacties.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {!file ? (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="text-lg font-medium text-slate-700 mb-2">Klik om document te uploaden</p>
                <p className="text-sm text-slate-500">PDF, JPG, of PNG (max 10MB)</p>
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium text-slate-900">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              {scanStatus === 'idle' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setFile(null)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={handleUpload}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Start AI Scan
                  </button>
                </div>
              )}
            </div>
          )}

          {(scanStatus === 'uploading' || scanStatus === 'analyzing' || scanStatus === 'extracting') && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-full">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <Brain className="w-5 h-5 text-blue-500" />
                <span className="text-blue-700 font-medium">{getStatusText()}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {transactions.length > 0 && (
          <div className="space-y-6">
            {/* Export Options Section - NEW */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Exporteer je data
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={exportToExcel}
                  className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FileSpreadsheet className="w-8 h-8" />
                  <span className="text-sm font-medium">Excel</span>
                </button>
                <button
                  onClick={exportToMT940}
                  className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border-2 border-yellow-400"
                >
                  <Database className="w-8 h-8 text-yellow-300" />
                  <span className="text-sm font-medium">MT940 ⭐</span>
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Table className="w-8 h-8" />
                  <span className="text-sm font-medium">CSV</span>
                </button>
                <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg opacity-50">
                  <FileCode className="w-8 h-8" />
                  <span className="text-sm font-medium">CAMT (binnenkort)</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-blue-100">
                💡 <strong>Tip voor boekhouders:</strong> Gebruik MT940 voor directe import in Exact, Twinfield, AFAS of SnelStart
              </p>
            </div>

            {/* Category Summary - NEW */}
            {categorySummary.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">🏷 Automatisch Gecategoriseerd</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pie Chart Visualization */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-3">Verdeling van je uitgaven</h4>
                    <div className="space-y-2">
                      {categorySummary.slice(0, 6).map((cat) => (
                        <div key={cat.id} className="flex items-center gap-3">
                          <span className="text-xl">{cat.category.emoji}</span>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-700">{cat.category.name}</span>
                              <span className="text-slate-500">{cat.percentage}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${cat.percentage}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-slate-700">€{cat.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Category Stats */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-500 mb-3">BTW-klaar overzicht</h4>
                    <div className="space-y-3">
                      {categorySummary.slice(0, 6).map((cat) => (
                        <div key={cat.id} className={`flex items-center justify-between p-2 rounded-lg ${cat.category.bgColor}`}>
                          <div className="flex items-center gap-2">
                            <span>{cat.category.emoji}</span>
                            <span className="text-sm font-medium text-slate-700">{cat.category.name}</span>
                          </div>
                          <span className="text-sm text-slate-600">{cat.count} transacties</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-slate-500">
                      ✨ Alle transacties zijn automatisch gecategoriseerd en BTW-percentages toegekend. Klaar voor je aangifte!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Summary */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {transactions.length} Transacties Gevonden
                    </h2>
                    <p className="text-slate-500">Bank: {bank}</p>
                  </div>
                  {rekeningnummer && (
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Rekening</p>
                      <p className="font-mono text-sm text-slate-700">{rekeningnummer}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Inkomsten</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    €{transactions.filter(t => t.bedrag > 0).reduce((sum, t) => sum + t.bedrag, 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-600 mb-1">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-medium">Uitgaven</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    €{transactions.filter(t => t.bedrag < 0).reduce((sum, t) => sum + Math.abs(t.bedrag), 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Datum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Omschrijving</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Categorie</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Bedrag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {transactions.map((t) => (
                      <tr key={t.id} className={`hover:bg-slate-50 ${t.categoryBgColor || ''}`}>
                        <td className="px-6 py-4 text-sm text-slate-900">{t.datum}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">{t.omschrijving}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100">
                            <span>{t.categoryEmoji || '📦'}</span>
                            <span className="text-slate-700">{t.categoryName || 'Overig'}</span>
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm font-medium text-right ${t.bedrag >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {t.bedrag >= 0 ? '+' : ''}€{t.bedrag.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
