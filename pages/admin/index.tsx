import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  Shield, Users, FileText, Download, TrendingUp, 
  AlertTriangle, CheckCircle, XCircle, Lock, 
  Activity, DollarSign, CreditCard, Settings,
  LogOut, BarChart3, Database, Zap, Globe
} from 'lucide-react';

interface SystemStats {
  totalUsers: number;
  totalConversions: number;
  totalRevenue: number;
  activeToday: number;
  storageUsed: string;
  avgProcessingTime: string;
}

interface RecentConversion {
  id: string;
  userEmail: string;
  bank: string;
  transactionCount: number;
  createdAt: string;
  status: 'completed' | 'failed' | 'processing';
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'conversions' | 'system'>('overview');
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalConversions: 0,
    totalRevenue: 0,
    activeToday: 0,
    storageUsed: '0 MB',
    avgProcessingTime: '0s'
  });
  const [recentConversions, setRecentConversions] = useState<RecentConversion[]>([]);
  const [showEnterpriseTest, setShowEnterpriseTest] = useState(false);

  // Admin auth check
  useEffect(() => {
    const adminSession = localStorage.getItem('bscpro_admin');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
      loadStats();
    }
  }, []);

  const handleLogin = () => {
    // In productie: gebruik een veilige hash check
    if (adminPassword === 'BSCPro2025!') {
      localStorage.setItem('bscpro_admin', 'true');
      setIsAuthenticated(true);
      loadStats();
    } else {
      alert('Onjuist wachtwoord');
    }
  };

  const loadStats = () => {
    // Mock data - in productie: fetch van API
    setStats({
      totalUsers: 247,
      totalConversions: 1843,
      totalRevenue: 8947.50,
      activeToday: 18,
      storageUsed: '2.4 GB',
      avgProcessingTime: '3.2s'
    });

    setRecentConversions([
      { id: '1', userEmail: 'test@bedrijf.nl', bank: 'ING', transactionCount: 45, createdAt: '2025-02-28 10:15', status: 'completed' },
      { id: '2', userEmail: 'admin@eigenbedrijf.nl', bank: 'Rabobank', transactionCount: 23, createdAt: '2025-02-28 09:45', status: 'completed' },
      { id: '3', userEmail: 'demo@accountant.nl', bank: 'ABN AMRO', transactionCount: 67, createdAt: '2025-02-28 09:30', status: 'processing' },
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('bscpro_admin');
    setIsAuthenticated(false);
    router.push('/');
  };

  // Enterprise Test Feature - QBO Export
  const runEnterpriseTest = async () => {
    const mockTransactions = [
      { datum: '15-02-2025', omschrijving: 'Test & Demo <script>', bedrag: -150.00, tegenpartij: 'Test Merchant' },
      { datum: '16-02-2025', omschrijving: 'International Payment', bedrag: 2500.00, tegenpartij: 'Global Corp' },
    ];

    try {
      const response = await fetch('/api/export/qbo', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Secret': 'BSCPro2025!' // Admin auth
        },
        body: JSON.stringify({
          transactions: mockTransactions,
          bank: 'TestBank',
          rekeningnummer: 'NL00TEST0000000000',
          user: { bedrijfsnaam: 'Admin Test BV' }
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ADMIN-TEST-QBO.qbo';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert('✅ QBO Export succesvol! Bestand gedownload.');
      } else {
        alert('❌ QBO Export mislukt');
      }
    } catch (error) {
      alert('❌ Error: ' + error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Head><title>Admin Login - BSC Pro</title></Head>
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Toegang</h1>
            <p className="text-muted-foreground mt-2">Beveiligde omgeving - Alleen geautoriseerd personeel</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Admin Wachtwoord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-[#00b8d9]"
                  placeholder="Voer admin wachtwoord in"
                />
              </div>
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-destructive text-white rounded-lg font-semibold hover:bg-destructive/90 transition-colors"
            >
              Inloggen
            </button>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-6">
            Dit systeem logt alle admin acties voor beveiliging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Head><title>Admin Dashboard - BSC Pro</title></Head>
      
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">BSC Pro Admin</h1>
                <p className="text-xs text-muted-foreground">God Mode - Alle functies ontgrendeld</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-medium">
                ● Systeem Online
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overzicht', icon: BarChart3 },
            { id: 'users', label: 'Gebruikers', icon: Users },
            { id: 'conversions', label: 'Conversies', icon: FileText },
            { id: 'system', label: 'Systeem', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === id 
                  ? 'bg-[#00b8d9]/10 text-[#00b8d9] border border-[#00b8d9]/30' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-[#00b8d9]" />
                  <span className="text-sm text-muted-foreground">Gebruikers</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.totalUsers}</p>
                <p className="text-xs text-emerald-500 mt-1">+12 deze week</p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-[#00b8d9]" />
                  <span className="text-sm text-muted-foreground">Conversies</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.totalConversions}</p>
                <p className="text-xs text-emerald-500 mt-1">+89 deze week</p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Omzet</span>
                </div>
                <p className="text-3xl font-bold text-foreground">€{stats.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-emerald-500 mt-1">+€450 deze week</p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Actief Vandaag</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.activeToday}</p>
                <p className="text-xs text-muted-foreground mt-1">gebruikers online</p>
              </div>
            </div>

            {/* Enterprise Test Section */}
            <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-500" />
                    Enterprise Features Test
                  </h3>
                  <p className="text-sm text-muted-foreground">Test alle premium functies als admin</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-600 rounded-full text-xs font-medium">
                  ADMIN ONLY
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={runEnterpriseTest}
                  className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg hover:border-amber-500/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">QBO Export Test</p>
                    <p className="text-xs text-muted-foreground">QuickBooks Online formaat</p>
                  </div>
                </button>
                
                <button
                  onClick={() => alert('API Test - In ontwikkeling')}
                  className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg hover:border-amber-500/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">API Toegang Test</p>
                    <p className="text-xs text-muted-foreground">Enterprise API endpoints</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-xl">
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold text-foreground">Recente Conversies</h3>
              </div>
              <div className="divide-y divide-border">
                {recentConversions.map((conv) => (
                  <div key={conv.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        conv.status === 'completed' ? 'bg-emerald-500' :
                        conv.status === 'processing' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{conv.userEmail}</p>
                        <p className="text-xs text-muted-foreground">{conv.bank} • {conv.transactionCount} transacties</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{conv.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Gebruikersbeheer</h3>
            <p className="text-muted-foreground">Hier komt een lijst van alle gebruikers met zoek- en filterfuncties.</p>
            <div className="mt-4 p-8 bg-muted/50 rounded-lg text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Gebruikerslijst wordt geladen...</p>
            </div>
          </div>
        )}

        {/* Conversions Tab */}
        {activeTab === 'conversions' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Conversie Geschiedenis</h3>
            <p className="text-muted-foreground">Alle conversies met export logs en debug informatie.</p>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-5 h-5 text-[#00b8d9]" />
                  <span className="text-sm text-muted-foreground">Storage Gebruik</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.storageUsed}</p>
                <p className="text-xs text-muted-foreground mt-1">van 10 GB</p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-[#00b8d9]" />
                  <span className="text-sm text-muted-foreground">Gem. Verwerkingstijd</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.avgProcessingTime}</p>
                <p className="text-xs text-emerald-500 mt-1">-0.3s vs vorige week</p>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Systeem Tools</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                  <p className="font-medium text-foreground">Cleanup Nu Uitvoeren</p>
                  <p className="text-xs text-muted-foreground">Oude bestanden verwijderen</p>
                </button>
                <button className="p-3 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                  <p className="font-medium text-foreground">Cache Legen</p>
                  <p className="text-xs text-muted-foreground">Server cache resetten</p>
                </button>
                <button className="p-3 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                  <p className="font-medium text-foreground">Logs Downloaden</p>
                  <p className="text-xs text-muted-foreground">Systeem logs (24u)</p>
                </button>
                <button className="p-3 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                  <p className="font-medium text-foreground">Database Backup</p>
                  <p className="text-xs text-muted-foreground">Handmatige backup maken</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}