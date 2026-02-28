'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Shield, LogOut, Globe, Zap, Activity, Users, FileText, DollarSign, 
  Settings, TrendingUp, BarChart3, Search, Download, Trash2, ArrowUpRight,
  ArrowDownRight, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw,
  Database, Server, CreditCard, Mail, PieChart, LayoutDashboard, Tool,
  Cpu, HardDrive, Wifi, Battery, Thermometer, Eye, EyeOff, FileSpreadsheet,
  Table, FileCode, Database as DatabaseIcon, Monitor, Smartphone,
  ChevronDown, ChevronUp, Filter, Calendar, MoreHorizontal, Edit3,
  Plus, Minus, RotateCcw, Save, Share2, Printer, Copy, ExternalLink,
  Upload, Zap as ZapIcon
} from 'lucide-react';

export default function AdminPage() {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">God Mode Admin</h1>
            <p className="text-muted-foreground mt-2">BSC Pro Super Admin</p>
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
    { id: 'overview', label: 'Overzicht', icon: LayoutDashboard },
    { id: 'users', label: 'Gebruikers', icon: Users },
    { id: 'conversions', label: 'Conversies', icon: FileText },
    { id: 'tools', label: 'Tools Tester', icon: Tool },
    { id: 'system', label: 'Systeem', icon: Server },
    { id: 'finance', label: 'Financiën', icon: DollarSign },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">BSC Pro God Mode</h1>
                <p className="text-xs text-muted-foreground">Super Admin Dashboard</p>
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

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
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

        {/* Content placeholder */}
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <p className="text-muted-foreground">
            Deze sectie wordt momenteel geüpdatet met God Mode features.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Actieve tab: <strong>{activeTab}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}