'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Shield, LogOut, Activity, Users, FileText, DollarSign, 
  Settings, TrendingUp, RefreshCw, Search, Download, Trash2, 
  Edit3, AlertTriangle, Database, Server, CreditCard, Mail,
  ChevronDown, X, Upload, CheckCircle, XCircle,
  Clock, Zap, HardDrive, Wifi
} from 'lucide-react';
import Link from 'next/link';

// Types
interface User {
  id: string;
  email: string;
  plan: string;
  created_at: string;
  conversions_count?: number;
}

interface Conversion {
  id: string;
  user_email: string;
  bank: string;
  format: string;
  status: string;
  created_at: string;
  transaction_count: number;
}

interface Stats {
  users: { total: number; activeToday: number };
  conversions: { total: number; today: number; daily: Record<string, number> };
  revenue: { total: number };
}

interface HealthStatus {
  database: boolean;
  apiConvert: boolean;
  apiCleanup: boolean;
  supabaseAuth: boolean;
  envVars: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [activityLog, setActivityLog] = useState<string[]>([]);
  
  // Data states
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [health, setHealth] = useState<HealthStatus>({
    database: false,
    apiConvert: false,
    apiCleanup: false,
    supabaseAuth: false,
    envVars: false,
  });

  // Load activity log from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin_activity_log');
    if (saved) {
      setActivityLog(JSON.parse(saved));
    }
  }, []);

  // Auth check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem('bscpro_admin');
      if (adminSession === 'true') {
        setIsAuthenticated(true);
        logActivity('Admin logged in');
      }
    }
  }, []);

  const logActivity = (action: string) => {
    const timestamp = new Date().toLocaleString();
    const logEntry = `[${timestamp}] ${action}`;
    setActivityLog(prev => {
      const newLog = [logEntry, ...prev].slice(0, 100);
      localStorage.setItem('admin_activity_log', JSON.stringify(newLog));
      return newLog;
    });
  };

  const handleLogin = () => {
    if (password === 'BSCPro2025!') {
      localStorage.setItem('bscpro_admin', 'true');
      setIsAuthenticated(true);
      logActivity('Admin logged in');
    } else {
      alert('Onjuist wachtwoord');
    }
  };

  const handleLogout = () => {
    logActivity('Admin logged out');
    localStorage.removeItem('bscpro_admin');
    setIsAuthenticated(false);
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const adminHeaders = { 'x-admin-secret': 'BSCPro2025!' };
      
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats', { headers: adminHeaders });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else {
        const err = await statsRes.json();
        setError(`Stats API: ${err.error || statsRes.statusText}`);
      }

      // Fetch users
      const usersRes = await fetch('/api/admin/users', { headers: adminHeaders });
      if (usersRes.ok) {
        setUsers(await usersRes.json());
      }

      // Fetch conversions
      const convRes = await fetch('/api/admin/conversions', { headers: adminHeaders });
      if (convRes.ok) {
        setConversions(await convRes.json());
      }

      setLastRefresh(new Date());
      logActivity(`Data refreshed - Tab: ${activeTab}`);
    } catch (err: any) {
      setError(`Fetch error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, activeTab]);

  // Health check
  const checkHealth = async () => {
    const adminHeaders = { 'x-admin-secret': 'BSCPro2025!' };
    
    try {
      const dbRes = await fetch('/api/admin/stats', { headers: adminHeaders });
      setHealth(prev => ({ ...prev, database: dbRes.ok }));
    } catch {
      setHealth(prev => ({ ...prev, database: false }));
    }
  };

  // Auto refresh
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchData();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchData]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">God Mode Admin</h1>
            <p className="text-muted-foreground mt-2">Super Admin Dashboard</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Wachtwoord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-[#00b8d9]"
                placeholder="Admin wachtwoord"
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-destructive text-white rounded-lg font-semibold hover:bg-destructive/90"
            >
              Inloggen
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overzicht', icon: Activity },
    { id: 'users', label: 'Gebruikers', icon: Users },
    { id: 'conversions', label: 'Conversies', icon: FileText },
    { id: 'tools', label: 'Tools Tester', icon: Zap },
    { id: 'system', label: 'Systeem', icon: Settings },
    { id: 'finance', label: 'Financiën', icon: DollarSign },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Error Banner */}
      {error && (
        <div className="bg-destructive/10 border-b border-destructive/30 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Error: {error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-destructive hover:opacity-70">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">BSC Pro God Mode</h1>
                <p className="text-xs text-muted-foreground">
                  Laatste update: {lastRefresh.toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground border border-border rounded-lg hover:text-foreground disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground border border-border rounded-lg hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
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

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'overview' && <OverviewTab stats={stats} isLoading={isLoading} />}
          {activeTab === 'users' && <UsersTab users={users} isLoading={isLoading} logActivity={logActivity} />}
          {activeTab === 'conversions' && <ConversionsTab conversions={conversions} isLoading={isLoading} />}
          {activeTab === 'tools' && <ToolsTesterTab logActivity={logActivity} />}
          {activeTab === 'system' && <SystemTab health={health} />}
          {activeTab === 'finance' && <FinanceTab />}
          {activeTab === 'marketing' && <MarketingTab />}
        </div>

        {/* Activity Log */}
        <div className="mt-8 bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-3">Admin Activiteit Log</h3>
          <div className="h-32 overflow-y-auto text-xs text-muted-foreground space-y-1 font-mono">
            {activityLog.slice(0, 20).map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Refresh */}
      <button
        onClick={fetchData}
        disabled={isLoading}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#00b8d9] text-[#080d14] rounded-full shadow-lg flex items-center justify-center disabled:opacity-50"
      >
        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}

// Simple tab components
function OverviewTab({ stats, isLoading }: { stats: Stats | null; isLoading: boolean }) {
  if (isLoading) return <div className="text-center py-12">Laden...</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Gebruikers</p>
        <p className="text-3xl font-bold">{stats?.users?.total || 0}</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Conversies</p>
        <p className="text-3xl font-bold">{stats?.conversions?.total || 0}</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Omzet</p>
        <p className="text-3xl font-bold">€{stats?.revenue?.total || 0}</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Actief vandaag</p>
        <p className="text-3xl font-bold">{stats?.users?.activeToday || 0}</p>
      </div>
    </div>
  );
}

function UsersTab({ users, isLoading, logActivity }: { users: User[]; isLoading: boolean; logActivity: (a: string) => void }) {
  const [filter, setFilter] = useState('');
  
  const filtered = users.filter(u => u.email?.toLowerCase().includes(filter.toLowerCase()));
  
  if (isLoading) return <div className="text-center py-12">Laden...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Zoek op email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-4 py-2 bg-card border border-border rounded-lg"
        />
        <button
          onClick={() => logActivity('Exported users CSV')}
          className="flex items-center gap-2 px-4 py-2 bg-[#00b8d9] text-[#080d14] rounded-lg"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Plan</th>
              <th className="text-left p-4">Acties</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-t border-border">
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.plan || 'free'}</td>
                <td className="p-4">
                  <button 
                    onClick={() => logActivity(`Edited user ${user.email}`)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConversionsTab({ conversions, isLoading }: { conversions: Conversion[]; isLoading: boolean }) {
  if (isLoading) return <div className="text-center py-12">Laden...</div>;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-4">User</th>
            <th className="text-left p-4">Bank</th>
            <th className="text-left p-4">Formaat</th>
            <th className="text-left p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {conversions.map((conv) => (
            <tr key={conv.id} className="border-t border-border">
              <td className="p-4">{conv.user_email}</td>
              <td className="p-4">{conv.bank}</td>
              <td className="p-4">{conv.format}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  conv.status === 'success' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-destructive/20 text-destructive'
                }`}>
                  {conv.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ToolsTesterTab({ logActivity }: { logActivity: (a: string) => void }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-semibold mb-4">Tools Tester</h3>
      <p className="text-muted-foreground">Upload een PDF om te testen</p>
      <button 
        onClick={() => logActivity('Tested conversion')}
        className="mt-4 px-4 py-2 bg-[#00b8d9] text-[#080d14] rounded-lg"
      >
        Test Conversie
      </button>
    </div>
  );
}

function SystemTab({ health }: { health: HealthStatus }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <HealthCard title="Database" status={health.database} />
      <HealthCard title="API Convert" status={health.apiConvert} />
      <HealthCard title="API Cleanup" status={health.apiCleanup} />
      <HealthCard title="Supabase Auth" status={health.supabaseAuth} />
      <HealthCard title="Env Vars" status={health.envVars} />
    </div>
  );
}

function HealthCard({ title, status }: { title: string; status: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${status ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-destructive/10 border-destructive/30'}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className={`text-lg font-bold ${status ? 'text-emerald-500' : 'text-destructive'}`}>
        {status ? '✓ Online' : '✗ Offline'}
      </p>
    </div>
  );
}

function FinanceTab() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-semibold mb-4">Financiën</h3>
      <p className="text-muted-foreground">MRR: €8,947</p>
    </div>
  );
}

function MarketingTab() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-semibold mb-4">Marketing</h3>
      <p className="text-muted-foreground">Email campaigns</p>
    </div>
  );
}