import { useState, useEffect } from 'react';
import { Calculator, Calendar, Clock, Bell, History, Trash2, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ToolHistory {
  id: string;
  tool: string;
  input: string;
  result: string;
  date: string;
}

export default function DashboardSmartTools() {
  const [activeTab, setActiveTab] = useState<'btw' | 'deadline'>('btw');
  const [history, setHistory] = useState<ToolHistory[]>([]);
  
  // BTW Calculator state
  const [btwAmount, setBtwAmount] = useState('');
  const [btwRate, setBtwRate] = useState(21);
  const [btwInclusive, setBtwInclusive] = useState(false);
  const [btwResult, setBtwResult] = useState({ sub: 0, btw: 0, total: 0 });
  
  // Deadline Checker state
  const [invoiceDate, setInvoiceDate] = useState('');
  const [paymentTerm, setPaymentTerm] = useState(30);
  const [deadlineResult, setDeadlineResult] = useState<{
    date: string;
    dayName: string;
    isWeekend: boolean;
    warning: string | null;
  } | null>(null);
  
  // Notification mock
  const [notificationSet, setNotificationSet] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bscpro_dashboard_tools_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setInvoiceDate(today);
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: ToolHistory[]) => {
    localStorage.setItem('bscpro_dashboard_tools_history', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  // BTW Calculation
  useEffect(() => {
    const val = parseFloat(btwAmount.replace(',', '.')) || 0;
    if (btwInclusive) {
      const sub = val / (1 + btwRate / 100);
      setBtwResult({ sub, btw: val - sub, total: val });
    } else {
      const btw = val * (btwRate / 100);
      setBtwResult({ sub: val, btw, total: val + btw });
    }
  }, [btwAmount, btwRate, btwInclusive]);

  // Deadline Calculation
  useEffect(() => {
    if (invoiceDate) {
      const start = new Date(invoiceDate);
      const verval = new Date(start);
      verval.setDate(verval.getDate() + paymentTerm);
      
      const dagIndex = verval.getDay();
      const isWeekend = dagIndex === 0 || dagIndex === 6;
      
      const dagen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
      const maanden = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
      
      let warning = null;
      if (isWeekend) {
        warning = dagIndex === 6 
          ? 'Let op: Valt op zaterdag, verwerk op vrijdag of maandag.'
          : 'Let op: Valt op zondag, verwerk op vrijdag of maandag.';
      }
      
      setDeadlineResult({
        date: `${verval.getDate()} ${maanden[verval.getMonth()]} ${verval.getFullYear()}`,
        dayName: dagen[dagIndex],
        isWeekend,
        warning
      });
    }
  }, [invoiceDate, paymentTerm]);

  const addToHistory = (tool: string, input: string, result: string) => {
    const newItem: ToolHistory = {
      id: Date.now().toString(),
      tool,
      input,
      result,
      date: new Date().toLocaleDateString('nl-NL')
    };
    const newHistory = [newItem, ...history].slice(0, 50); // Keep last 50
    saveHistory(newHistory);
  };

  const clearHistory = () => {
    if (confirm('Weet je zeker dat je je geschiedenis wilt wissen?')) {
      saveHistory([]);
    }
  };

  const scheduleNotification = () => {
    // Mock notification scheduling
    setNotificationSet(true);
    setTimeout(() => setNotificationSet(false), 3000);
    
    // In a real implementation, this would use the Notifications API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('BSC Pro - Herinnering gepland', {
        body: `Je ontvangt een herinnering voor de factuur van ${invoiceDate}`,
        icon: '/logo.svg'
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#00b8d9]" />
          <div>
            <h3 className="text-xl font-semibold text-foreground">Smart Tools</h3>
            <p className="text-sm text-muted-foreground">
              Exclusief voor ZZP en Pro leden
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 p-1 bg-secondary rounded-lg">
        <button
          onClick={() => setActiveTab('btw')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'btw'
              ? 'bg-[#00b8d9] text-[#080d14]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calculator className="w-4 h-4" />
          BTW Calculator
        </button>
        <button
          onClick={() => setActiveTab('deadline')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'deadline'
              ? 'bg-[#00b8d9] text-[#080d14]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Deadline Checker
        </button>
      </div>

      {/* BTW Calculator */}
      {activeTab === 'btw' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Bedrag (€)</label>
            <input
              type="text"
              value={btwAmount}
              onChange={(e) => setBtwAmount(e.target.value)}
              placeholder="0,00"
              className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">BTW tarief</label>
            <div className="flex gap-2">
              {[21, 9, 0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setBtwRate(rate)}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                    btwRate === rate
                      ? 'bg-[#00b8d9] text-white'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <span className="text-sm text-muted-foreground">Inclusief BTW</span>
            <button
              onClick={() => setBtwInclusive(!btwInclusive)}
              className={`w-12 h-6 rounded-full transition-all relative ${
                btwInclusive ? 'bg-[#00b8d9]' : 'bg-muted'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                btwInclusive ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>

          {btwAmount && (
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Exclusief:</span>
                  <span className="text-white">€{btwResult.sub.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">BTW ({btwRate}%):</span>
                  <span className="text-[#00b8d9]">€{btwResult.btw.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between">
                  <span className="text-white font-bold">Totaal:</span>
                  <span className="text-xl font-bold text-white">€{btwResult.total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => addToHistory('BTW Calculator', `€${btwAmount} @ ${btwRate}%`, `€${btwResult.total.toFixed(2)}`)}
                className="w-full mt-4 py-2 bg-[#00b8d9]/10 text-[#00b8d9] rounded-lg text-sm font-semibold hover:bg-[#00b8d9]/20 transition-all"
              >
                Opslaan in geschiedenis
              </button>
            </div>
          )}
        </div>
      )}

      {/* Deadline Checker */}
      {activeTab === 'deadline' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Factuurdatum</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Betalingstermijn</label>
            <div className="flex gap-2">
              {[14, 30, 60].map((term) => (
                <button
                  key={term}
                  onClick={() => setPaymentTerm(term)}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                    paymentTerm === term
                      ? 'bg-[#00b8d9] text-white'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {term} dgn
                </button>
              ))}
            </div>
          </div>

          {deadlineResult && (
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
              <div className="text-center mb-4">
                <span className="text-slate-400 text-sm">Vervaldatum:</span>
                <div className="text-2xl font-bold text-white mt-1">
                  {deadlineResult.date}
                </div>
                <div className="text-[#00b8d9] font-semibold capitalize">
                  {deadlineResult.dayName}
                </div>
              </div>
              
              {deadlineResult.isWeekend ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4">
                  <p className="text-amber-400 text-sm font-semibold">⚠️ {deadlineResult.warning}</p>
                </div>
              ) : (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
                  <p className="text-green-400 text-sm font-semibold">✓ Doe gewoon op deze dag</p>
                </div>
              )}
              
              {/* Pro feature: Schedule notification */}
              <button
                onClick={scheduleNotification}
                className="w-full py-2 bg-[#00b8d9]/10 text-[#00b8d9] rounded-lg text-sm font-semibold hover:bg-[#00b8d9]/20 transition-all flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                {notificationSet ? 'Herinnering gepland!' : 'Plan herinnering (Pro)'}
              </button>
              
              <button
                onClick={() => addToHistory('Deadline Checker', `Factuur ${invoiceDate} + ${paymentTerm}d`, deadlineResult.date)}
                className="w-full mt-2 py-2 bg-secondary text-foreground rounded-lg text-sm font-semibold hover:bg-secondary/80 transition-all"
              >
                Opslaan in geschiedenis
              </button>
            </div>
          )}
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <History className="w-4 h-4" />
              Laatste berekeningen ({history.length})
            </h4>
            <button
              onClick={clearHistory}
              className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Wissen
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.slice(0, 5).map((item) => (
              <div key={item.id} className="p-3 bg-secondary rounded-lg text-sm">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-foreground">{item.tool}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <div className="text-muted-foreground mt-1">
                  {item.input} → <span className="text-[#00b8d9] font-semibold">{item.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
