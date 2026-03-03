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
import CategoriesTab from '@/components/CategoriesTab'

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
    if (password === (process.env.NEXT_PUBLIC_ADMIN_SECRET || "BSCPro2025!")) {
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
      const adminHeaders = { 'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || 'BSCPro2025!' };
      
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
        const data = await usersRes.json(); setUsers(data.users || []);
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

  // Health check - comprehensive
  const checkHealth = async () => {
    const adminHeaders = { 'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || 'BSCPro2025!' };
    
    // Check Database
    try {
      const dbRes = await fetch('/api/admin/stats', { headers: adminHeaders });
      setHealth(prev => ({ ...prev, database: dbRes.ok }));
    } catch {
      setHealth(prev => ({ ...prev, database: false }));
    }
    
    // Check API Convert
    try {
      const convertRes = await fetch('/api/convert', { method: 'OPTIONS' });
      setHealth(prev => ({ ...prev, apiConvert: convertRes.ok || convertRes.status === 405 }));
    } catch {
      setHealth(prev => ({ ...prev, apiConvert: false }));
    }
    
    // Check API Cleanup
    try {
      const cleanupRes = await fetch('/api/cleanup', { headers: adminHeaders });
      setHealth(prev => ({ ...prev, apiCleanup: cleanupRes.ok }));
    } catch {
      setHealth(prev => ({ ...prev, apiCleanup: false }));
    }
    
    // Check Supabase Auth
    try {
      const session = localStorage.getItem('bscpro_session');
      setHealth(prev => ({ ...prev, supabaseAuth: !!session }));
    } catch {
      setHealth(prev => ({ ...prev, supabaseAuth: false }));
    }
    
    // Check Env Vars
    try {
      const envRes = await fetch('/api/health');
      setHealth(prev => ({ ...prev, envVars: envRes.ok }));
    } catch {
      setHealth(prev => ({ ...prev, envVars: false }));
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
    { id: 'categories', label: 'Categorieën', icon: Database },
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
          {activeTab === 'users' && <UsersTab users={users} isLoading={isLoading} logActivity={logActivity} onRefresh={fetchData} />}
          {activeTab === 'conversions' && <ConversionsTab conversions={conversions} isLoading={isLoading} />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'tools' && <ToolsTesterTab logActivity={logActivity} />}
          {activeTab === 'system' && <SystemTab health={health} />}
          {activeTab === 'finance' && <FinanceTab users={users} />}
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

function UsersTab({ users, isLoading, logActivity, onRefresh }: { 
  users: User[]; 
  isLoading: boolean; 
  logActivity: (a: string) => void;
  onRefresh: () => void;
}) {
  const [search, setSearch] = useState('')
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editPlan, setEditPlan] = useState('')
  const [editCredits, setEditCredits] = useState(0)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const planColor = (plan: string) => {
    const colors: Record<string, string> = {
      'free': 'bg-muted text-muted-foreground',
      'starter': 'bg-blue-500/20 text-blue-400',
      'pro': 'bg-[#00b8d9]/20 text-[#00b8d9]',
      'business': 'bg-purple-500/20 text-purple-400',
      'enterprise': 'bg-amber-500/20 text-amber-400',
    }
    return colors[plan?.toLowerCase()] || 'bg-muted text-muted-foreground'
  }

  const handleSaveUser = async () => {
    if (!editUser) return
    setSaving(true)
    try {
      // Bereken nieuwe credits (huidige + extra)
      const currentCredits = editUser.conversions_count || 0
      const newCredits = editCredits > 0 ? currentCredits + editCredits : currentCredits
      
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || 'BSCPro2025!'
        },
        body: JSON.stringify({ 
          userId: editUser.id, 
          plan: editPlan,
          credits: newCredits 
        })
      })
      if (res.ok) {
        const data = await res.json()
        alert(data.message || "Gebruiker succesvol bijgewerkt")

        logActivity('Updated user ' + editUser.email + ': plan=' + editPlan + (editCredits > 0 ? ', added ' + editCredits + ' credits' : ''))
        setEditUser(null)
        onRefresh()
      }
    } catch {}
    setSaving(false)
  }

  const handleDelete = async (userId: string, email: string) => {
    try {
      const res = await fetch('/api/admin/users?userId=' + userId, {
        method: 'DELETE',
        headers: { 'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || 'BSCPro2025!' }
      })
      if (res.ok) {
        alert("Gebruiker succesvol verwijderd")

        logActivity('Deleted user: ' + email)
        setConfirmDelete(null)
        onRefresh()
      }
    } catch {}
  }

  const handleExportCSV = () => {
    const headers = ['Email', 'Plan', 'Conversies', 'Aangemaakt']
    const rows = filtered.map(u => [
      u.email,
      u.plan || 'free',
      u.conversions_count || 0,
      u.created_at ? new Date(u.created_at).toLocaleDateString('nl-NL') : '—'
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bscpro-users-' + new Date().toISOString().split('T')[0] + '.csv'
    a.click()
    logActivity('Exported ' + filtered.length + ' users to CSV')
  }

  if (isLoading) return <div className="text-center py-12">Laden...</div>

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Zoek op email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
          />
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-accent transition-colors"
        >
          📥 Export CSV
        </button>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filtered.length} gebruikers
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Plan</th>
              <th className="text-left p-4">Conversies</th>
              <th className="text-left p-4">Aangemaakt</th>
              <th className="text-left p-4">Acties</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className={'px-2 py-1 rounded-full text-xs ' + planColor(user.plan)}>
                    {user.plan || 'free'}
                  </span>
                </td>
                <td className="p-4">{user.conversions_count || 0}</td>
                <td className="p-4 text-muted-foreground">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('nl-NL') : '—'}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditUser(user)
                        setEditPlan(user.plan || 'free')
                        setEditCredits(user.conversions_count || 0)
                      }}
                      className="p-2 text-muted-foreground hover:text-[#00b8d9] transition-colors"
                      title="Bewerken"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(user.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      title="Verwijderen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Gebruiker bewerken</h3>
            <p className="text-sm text-muted-foreground mb-4">{editUser.email}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plan</label>
                <select
                  value={editPlan}
                  onChange={e => setEditPlan(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                >
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="business">Business</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Credits</label>
                <input
                  type="number"
                  value={editCredits}
                  onChange={e => setEditCredits(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditUser(null)}
                className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-accent transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={handleSaveUser}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-[#00b8d9] text-[#080d14] rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Opslaan...' : 'Opslaan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Gebruiker verwijderen?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Deze actie kan niet ongedaan worden gemaakt. Alle gegevens van deze gebruiker worden permanent verwijderd.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-accent transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={() => {
                  const user = users.find(u => u.id === confirmDelete)
                  if (user) handleDelete(user.id, user.email)
                }}
                className="flex-1 px-4 py-2 bg-destructive text-white rounded-lg text-sm font-medium hover:bg-destructive/90"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
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
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleTest = async () => {
    if (!file) {
      setError('Selecteer eerst een PDF')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Conversie mislukt')
      } else {
        setResult(data)
        logActivity('Tested conversion: ' + data.transactieCount + ' transacties gevonden')
      }
    } catch (err) {
      setError('Netwerk error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-lg">🧪 AI Conversie Tester</h3>
      
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <input 
          type="file" 
          accept=".pdf" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden" 
          id="test-pdf-upload" 
        />
        <label htmlFor="test-pdf-upload" className="cursor-pointer">
          <p className="text-muted-foreground mb-2">
            {file ? '✅ ' + file.name : 'Klik om een PDF te selecteren'}
          </p>
          <span className="px-3 py-1.5 bg-muted rounded-lg text-sm">
            Bladeren
          </span>
        </label>
      </div>

      <button 
        onClick={handleTest}
        disabled={loading || !file}
        className="w-full px-4 py-3 bg-[#00b8d9] text-[#080d14] rounded-lg font-medium disabled:opacity-50"
      >
        {loading ? '⏳ Verwerken...' : '🚀 Test AI Conversie'}
      </button>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg space-y-2">
          <p className="font-medium text-emerald-600">✅ Conversie geslaagd!</p>
          <div className="text-sm space-y-1">
            <p>🏦 Bank: <strong>{result.data?.bank || 'Onbekend'}</strong></p>
            <p>📊 Transacties: <strong>{result.transactieCount}</strong></p>
            <p>👤 Rekeninghouder: <strong>{result.data?.rekeninghouder || '—'}</strong></p>
            <p>📅 Periode: <strong>{result.data?.periode?.van || '—'} → {result.data?.periode?.tot || '—'}</strong></p>
          </div>
          {result && result.data?.transacties && (
          <div className="mt-4 space-y-2">
            <p className="font-medium text-sm">📋 Transacties:</p>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {result.data.transacties.map((t: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                  <div className="flex gap-3">
                    <span className="text-muted-foreground">{t.datum}</span>
                    <span className="truncate max-w-[180px]">{t.omschrijving}</span>
                  </div>
                  <span className={t.bedrag >= 0 ? 'text-emerald-500 font-medium' : 'text-destructive font-medium'}>
                    {t.bedrag >= 0 ? '+' : ''}€{t.bedrag.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  )
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
  const statusConfig: Record<string, Record<string, { bg: string; text: string; icon: string; label: string; description: string }>> = {
    'Database': {
      'true': { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-500', icon: '✅', label: 'Online', description: 'Supabase verbonden' },
      'false': { bg: 'bg-destructive/10 border-destructive/30', text: 'text-destructive', icon: '❌', label: 'Offline', description: 'Database niet bereikbaar' }
    },
    'API Convert': {
      'true': { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-500', icon: '✅', label: 'Actief', description: 'AI conversie werkt' },
      'false': { bg: 'bg-destructive/10 border-destructive/30', text: 'text-destructive', icon: '❌', label: 'Offline', description: 'Conversie API niet bereikbaar' }
    },
    'API Cleanup': {
      'true': { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-500', icon: '✅', label: 'Actief', description: 'Cleanup cron draait' },
      'false': { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-500', icon: '⚠️', label: 'Gepauzeerd', description: 'Cleanup niet actief' }
    },
    'Supabase Auth': {
      'true': { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-500', icon: '✅', label: 'Actief', description: 'Authenticatie werkt' },
      'false': { bg: 'bg-destructive/10 border-destructive/30', text: 'text-destructive', icon: '❌', label: 'Fout', description: 'Auth service problemen' }
    },
    'Env Vars': {
      'true': { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-500', icon: '✅', label: 'Compleet', description: 'Alle variabelen geladen' },
      'false': { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-500', icon: '⚠️', label: 'Incomplete', description: 'Sommige variabelen missen' }
    }
  };
  
  const config = statusConfig[title]?.[String(status)] || {
    bg: status ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-destructive/10 border-destructive/30',
    text: status ? 'text-emerald-500' : 'text-destructive',
    icon: status ? '✅' : '❌',
    label: status ? 'Online' : 'Offline',
    description: status ? 'Systeem operationeel' : 'Probleem gedetecteerd'
  };

  return (
    <div className={`p-4 rounded-xl border ${config.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">{title}</p>
        <span className="text-lg">{config.icon}</span>
      </div>
      <p className={`text-lg font-bold ${config.text}`}>
        {config.label}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {config.description}
      </p>
    </div>
  );
}

function FinanceTab({ users }: { users: User[] }) {
  const planPrices: Record<string, number> = {
    'starter': 12,
    'pro': 29,
    'business': 69,
    'enterprise': 199,
    'free': 0
  }
  
  const mrr = users.reduce((sum, u) => {
    return sum + (planPrices[u.plan?.toLowerCase()] || 0)
  }, 0)
  
  const paidUsers = users.filter(u => u.plan && u.plan !== 'free').length
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">MRR</p>
          <p className="text-3xl font-bold text-[#00b8d9]">
            €{mrr.toLocaleString('nl-NL')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Berekend uit actieve abonnementen
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Betalende gebruikers</p>
          <p className="text-3xl font-bold">{paidUsers}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Van {users.length} totaal
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">ARR (geschat)</p>
          <p className="text-3xl font-bold">€{(mrr * 12).toLocaleString('nl-NL')}</p>
          <p className="text-xs text-muted-foreground mt-1">
            MRR × 12
          </p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="font-medium mb-4">Plan verdeling</h4>
        <div className="space-y-2">
          {['enterprise', 'business', 'pro', 'starter', 'free'].map(plan => {
            const count = users.filter(u => (u.plan || 'free') === plan).length
            const revenue = count * (planPrices[plan] || 0)
            return (
              <div key={plan} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="capitalize font-medium w-20">{plan}</span>
                  <span className="text-muted-foreground">{count} gebruikers</span>
                </div>
                <span className="font-medium">
                  {revenue > 0 ? '€' + revenue + '/mnd' : '—'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MarketingTab() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-semibold mb-4">Marketing</h3>
      <p className="text-muted-foreground">Email campaigns</p>
    </div>
  );
}