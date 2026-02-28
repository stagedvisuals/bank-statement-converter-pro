'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, LogOut, Globe, Zap, Database, Activity, Users, FileText, DollarSign } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem('bscpro_admin');
      if (adminSession === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = () => {
    if (password === 'BSCPro2025!') {
      localStorage.setItem('bscpro_admin', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Onjuist wachtwoord');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bscpro_admin');
    setIsAuthenticated(false);
  };

  const runEnterpriseTest = async () => {
    try {
      const response = await fetch('/api/export/qbo', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Secret': 'BSCPro2025!'
        },
        body: JSON.stringify({
          transactions: [
            { datum: '15-02-2025', omschrijving: 'Test & Demo', bedrag: -150.00, tegenpartij: 'Test Merchant' },
            { datum: '16-02-2025', omschrijving: 'International Payment', bedrag: 2500.00, tegenpartij: 'Global Corp' },
          ],
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
    return (<div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Toegang</h1>
            <p className="text-muted-foreground mt-2">Beveiligde omgeving</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Wachtwoord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
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

  return (<div className="min-h-screen bg-background">
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
                <p className="text-xs text-muted-foreground">God Mode</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground border border-border rounded-lg hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overzicht', icon: Activity },
            { id: 'enterprise', label: 'Enterprise', icon: Globe },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
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

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <Users className="w-5 h-5 text-[#00b8d9] mb-2" />
                <p className="text-3xl font-bold text-foreground">247</p>
                <p className="text-xs text-muted-foreground">Gebruikers</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <FileText className="w-5 h-5 text-[#00b8d9] mb-2" />
                <p className="text-3xl font-bold text-foreground">1,843</p>
                <p className="text-xs text-muted-foreground">Conversies</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <DollarSign className="w-5 h-5 text-emerald-500 mb-2" />
                <p className="text-3xl font-bold text-foreground">€8,947</p>
                <p className="text-xs text-muted-foreground">Omzet</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <Activity className="w-5 h-5 text-amber-500 mb-2" />
                <p className="text-3xl font-bold text-foreground">18</p>
                <p className="text-xs text-muted-foreground">Actief vandaag</p>
              </div>
            </div>

            {/* Enterprise Test */}
            <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Enterprise Features</h3>
              <button
                onClick={runEnterpriseTest}
                className="flex items-center gap-3 px-6 py-3 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Globe className="w-5 h-5" />
                Test QBO Export
              </button>
            </div>
          </div>
        )}

        {activeTab === 'enterprise' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Enterprise Test Tools</h3>
            <div className="space-y-4">
              <button
                onClick={runEnterpriseTest}
                className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:border-[#00b8d9]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#00b8d9]" />
                  <div>
                    <p className="font-medium text-foreground">QBO Export Test</p>
                    <p className="text-xs text-muted-foreground">QuickBooks Online formaat</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-1 rounded">Admin Only</span>
              </button>
              
              <button
                onClick={() => alert('API Test - Coming soon')}
                className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:border-[#00b8d9]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium text-foreground">API Test</p>
                    <p className="text-xs text-muted-foreground">Enterprise API endpoints</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-1 rounded">Admin Only</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}