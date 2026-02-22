import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { 
  FileText, 
  Upload, 
  Download, 
  Zap, 
  CreditCard, 
  CheckCircle,
  AlertTriangle,
  Edit3,
  FileJson,
  Trash2,
  Plus,
  X,
  TrendingUp,
  PieChart,
  Shield,
  AlertCircle,
  Brain,
  Tag,
  LogOut,
  User
} from 'lucide-react'

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'debit' | 'credit'
  confidence: number
  category: string
  fraud_risk_score: number
  fraud_warnings: string[]
  status: 'OK' | 'WARNING' | 'SUSPICIOUS'
  tegenrekening?: string
}

const CATEGORY_COLORS: Record<string, string> = {
  HUISVESTING: '#3B82F6',
  MARKETING: '#8B5CF6',
  SOFTWARE_SAAS: '#10B981',
  PERSONEEL: '#F59E0B',
  BELASTINGEN: '#EF4444',
  REISKOSTEN: '#06B6D4',
  VERZEKERINGEN: '#EC4899',
  INKOOP: '#6366F1',
  FINANCIEEL: '#84CC16',
  OVERIG: '#9CA3AF'
}

const CATEGORY_NAMES: Record<string, string> = {
  HUISVESTING: 'Huisvesting',
  MARKETING: 'Marketing',
  SOFTWARE_SAAS: 'Software/SaaS',
  PERSONEEL: 'Personeel',
  BELASTINGEN: 'Belastingen',
  REISKOSTEN: 'Reiskosten',
  VERZEKERINGEN: 'Verzekeringen',
  INKOOP: 'Inkoop',
  FINANCIEEL: 'Financieel',
  OVERIG: 'Overig'
}

function SimplePieChart({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0)
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 5)
  let currentAngle = 0
  
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {entries.map(([category, amount]) => {
            const percentage = (amount / total) * 100
            const angle = (percentage / 100) * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle
            const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180)
            const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180)
            const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180)
            const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180)
            const largeArc = angle > 180 ? 1 : 0
            const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`, 'Z'].join(' ')
            currentAngle += angle
            return (
              <path key={category} d={pathData} fill={CATEGORY_COLORS[category] || '#9CA3AF'} stroke="white" strokeWidth="2" />
            )
          })}
          <circle cx="50" cy="50" r="20" fill="white" />
        </svg>
      </div>
      <div className="space-y-2">
        {entries.map(([category, amount]) => (
          <div key={category} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[category] || '#9CA3AF' }} />
            <span className="text-slate">{CATEGORY_NAMES[category] || category}</span>
            <span className="text-navy font-medium">€{amount.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [summary, setSummary] = useState<any>(null)

  const role = user?.role || 'user'
  const isPro = role === 'pro' || role === 'admin'
  const isEnterprise = role === 'enterprise' || role === 'admin'

  useEffect(() => {
    // Check session
    const session = localStorage.getItem('bscpro_session')
    const userData = localStorage.getItem('bscpro_user')
    
    if (!session) {
      router.push('/login')
      return
    }
    
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoaded(true)
  }, [router])
  
  const handleLogout = () => {
    localStorage.removeItem('bscpro_session')
    localStorage.removeItem('bscpro_user')
    router.push('/login')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadSuccess(true)
      setResult(null)
      setPreviewMode(false)
      setTransactions([])
      setSummary(null)
      setTimeout(() => setUploadSuccess(false), 3000)
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setConverting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/convert', { method: 'POST', body: formData })
      const data = await response.json()
      if (response.ok) {
        setResult(data)
        setSummary(data.summary)
        const transformedTransactions = data.transactions.map((t: any, index: number) => ({
          id: index.toString(),
          date: t.datum || t.date || '',
          description: t.omschrijving || t.description || '',
          amount: parseFloat(t.bedrag || t.amount || 0),
          type: parseFloat(t.bedrag || t.amount || 0) > 0 ? 'credit' : 'debit',
          confidence: t.confidence || 95,
          category: t.category || 'OVERIG',
          fraud_risk_score: t.fraud_risk_score || 0,
          fraud_warnings: t.fraud_warnings || [],
          status: t.status || 'OK',
          tegenrekening: t.tegenrekening || ''
        }))
        setTransactions(transformedTransactions)
        setPreviewMode(true)
      } else {
        alert(data.error || 'Conversion failed')
      }
    } catch (error) {
      alert('Upload failed')
    } finally {
      setConverting(false)
    }
  }

  const handleEditTransaction = (id: string, field: keyof Transaction, value: any) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const handleAddTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: 0,
      type: 'debit',
      confidence: 100,
      category: 'OVERIG',
      fraud_risk_score: 0,
      fraud_warnings: [],
      status: 'OK'
    }
    setTransactions(prev => [...prev, newTransaction])
    setEditingId(newTransaction.id)
  }

  const getStatusIcon = (status: string, riskScore: number) => {
    if (status === 'SUSPICIOUS' || riskScore > 30) return <AlertTriangle className="w-5 h-5 text-danger" />
    if (status === 'WARNING' || riskScore > 10) return <AlertCircle className="w-5 h-5 text-warning" />
    return <Shield className="w-5 h-5 text-success" />
  }

  const getStatusTooltip = (transaction: Transaction) => {
    if (transaction.fraud_warnings.length > 0) return transaction.fraud_warnings.join(', ')
    if (transaction.status === 'OK') return 'Geen problemen gedetecteerd'
    return transaction.status
  }

  const getCategoryBadge = (category: string) => {
    const color = CATEGORY_COLORS[category] || '#9CA3AF'
    const name = CATEGORY_NAMES[category] || category
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${color}20`, color: color }}>
        <Tag className="w-3 h-3 mr-1" />
        {name}
      </span>
    )
  }

  const exportToJSON = () => {
    const exportData = transactions.map(t => ({
      datum: t.date, omschrijving: t.description, bedrag: t.amount,
      categorie: t.category, risk_score: t.fraud_risk_score,
      status: t.status, confidence: t.confidence
    }))
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions_ai_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    const headers = ['Datum', 'Omschrijving', 'Bedrag', 'Categorie', 'Risk Score', 'Status', 'Confidence']
    const rows = transactions.map(t => [t.date, `"${t.description}"`, t.amount.toFixed(2), t.category, t.fraud_risk_score, t.status, `${t.confidence}%`])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions_ai_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isLoaded || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-fintech-bg"><div className="text-navy">Laden...</div></div>
  }

  return (
    <div className="min-h-screen bg-fintech-bg">
      <nav className="glass sticky top-0 z-50 card-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold gradient-text">BSC Pro</Link>
            <div className="flex items-center space-x-4">
              {isPro && <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">PRO</span>}
              <span className="text-slate text-sm">Credits: <span className="text-success font-bold">{isPro ? '∞' : '2'}</span></span>
              <div className="flex items-center gap-2">
                <span className="text-slate text-sm hidden md:inline">{user?.email}</span>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  title="Uitloggen"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!previewMode && (
              <div className="bg-white rounded-2xl p-8 card-shadow border border-fintech-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-navy">AI Document Intelligence</h2>
                    <p className="text-slate text-sm">Upload je PDF voor slimme analyse en categorisatie</p>
                  </div>
                </div>
                {!isPro && (
                  <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-navy font-medium">Upgrade naar Business</p>
                        <p className="text-slate text-sm">Krijg AI categorisatie, fraude detectie en business insights.</p>
                        <Link href="/#pricing" className="text-success hover:underline text-sm font-medium inline-flex items-center gap-1 mt-1">Bekijk prijzen →</Link>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-fintech-border rounded-xl p-8 text-center hover:border-success transition-colors bg-fintech-bg/50">
                    <input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" id="pdf-upload" />
                    <label htmlFor="pdf-upload" className="cursor-pointer block">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-slate" />
                      <p className="text-navy font-medium">Klik om PDF te uploaden</p>
                      <p className="text-slate text-sm mt-1">of sleep je bestand hierheen</p>
                      <p className="text-slate text-xs mt-2">Max 10MB • PDF formaat</p>
                    </label>
                  </div>
                  {file && (
                    <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-navy font-medium truncate">{file.name}</p>
                          <p className="text-slate text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {uploadSuccess && <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-success text-center text-sm">✓ Bestand succesvol geüpload!</div>}
                  <button onClick={handleConvert} disabled={!file || converting} className="w-full py-4 bg-success text-white font-bold rounded-xl hover:bg-success-dark transition-all hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {converting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>AI analyseert document...</> : <><Brain className="w-5 h-5" />Start AI Analyse</>}
                  </button>
                </div>
              </div>
            )}

            {previewMode && summary && (
              <div className="bg-white rounded-2xl p-6 card-shadow border border-fintech-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy">AI Business Insights</h3>
                    <p className="text-slate text-sm">Gegenereerd door AI analyse</p>
                  </div>
                </div>
                {summary.biggestCategory && (
                  <div className="mb-6 p-4 bg-accent/5 border border-accent/10 rounded-xl">
                    <p className="text-slate text-sm">
                      Je grootste kostenpost deze maand was <span className="font-semibold text-navy">{CATEGORY_NAMES[summary.biggestCategory.name] || summary.biggestCategory.name}</span> (€{summary.biggestCategory.amount.toFixed(2)})
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-fintech-bg p-4 rounded-xl text-center">
                    <p className="text-slate text-xs mb-1">Totaal Inkomen</p>
                    <p className="text-success font-bold text-lg">€{summary.totalIncome?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="bg-fintech-bg p-4 rounded-xl text-center">
                    <p className="text-slate text-xs mb-1">Totaal Uitgaven</p>
                    <p className="text-danger font-bold text-lg">€{summary.totalExpenses?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="bg-fintech-bg p-4 rounded-xl text-center">
                    <p className="text-slate text-xs mb-1">Netto Resultaat</p>
                    <p className={`font-bold text-lg ${(summary.netResult || 0) >= 0 ? 'text-success' : 'text-danger'}`}>€{summary.netResult?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
                {summary.categories && Object.keys(summary.categories).length > 0 && (
                  <div className="border-t border-fintech-border pt-6">
                    <h4 className="font-semibold text-navy mb-4">Uitgaven per Categorie</h4>
                    <SimplePieChart data={summary.categories} />
                  </div>
                )}
                {summary.suspiciousCount > 0 && (
                  <div className="mt-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-navy font-medium text-sm">AI Fraude Detectie Alert</p>
                      <p className="text-slate text-sm">{summary.suspiciousCount} transactie(s) gemarkeerd voor controle. Bekijk de tabel hieronder voor details.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {previewMode && (
              <div className="bg-white rounded-2xl p-6 card-shadow border border-fintech-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Edit3 className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy">AI Categorieën & Controle</h3>
                      <p className="text-slate text-sm">Bewerk indien nodig voordat je exporteert</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPreviewMode(false)} className="px-4 py-2 text-slate hover:text-navy transition-colors text-sm">Annuleren</button>
                    {isEnterprise && <button onClick={exportToJSON} className="px-4 py-2 bg-navy/10 text-navy rounded-lg hover:bg-navy/20 transition-colors text-sm font-medium flex items-center gap-2"><FileJson className="w-4 h-4" />JSON</button>}
                    <button onClick={exportToExcel} className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success-dark transition-colors text-sm font-medium flex items-center gap-2"><Download className="w-4 h-4" />Export</button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4 text-xs">
                  <span className="text-slate">AI Status:</span>
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-success" /><span className="text-slate">OK</span></div>
                  <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-warning" /><span className="text-slate">Controle</span></div>
                  <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-danger" /><span className="text-slate">Verdacht</span></div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-fintech-bg text-left">
                      <tr>
                        <th className="px-3 py-3 text-xs font-semibold text-slate uppercase">Status</th>
                        <th className="px-3 py-3 text-xs font-semibold text-slate uppercase">Datum</th>
                        <th className="px-3 py-3 text-xs font-semibold text-slate uppercase">Omschrijving</th>
                        <th className="px-3 py-3 text-xs font-semibold text-slate uppercase">Bedrag</th>
                        <th className="px-3 py-3 text-xs font-semibold text-slate uppercase">AI Categorie</th>
                        <th className="px-3 py-3 text-xs font-semibold text-slate uppercase text-center">Actie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-fintech-border">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className={transaction.status === 'SUSPICIOUS' ? 'bg-danger/5' : transaction.status === 'WARNING' ? 'bg-warning/5' : ''}>
                          <td className="px-3 py-3"><div title={getStatusTooltip(transaction)} className="cursor-help">{getStatusIcon(transaction.status, transaction.fraud_risk_score)}</div></td>
                          <td className="px-3 py-3">{editingId === transaction.id ? <input type="date" value={transaction.date} onChange={(e) => handleEditTransaction(transaction.id, 'date', e.target.value)} className="w-full px-2 py-1 border border-fintech-border rounded text-sm" /> : <span className="text-navy text-sm">{transaction.date}</span>}</td>
                          <td className="px-3 py-3">{editingId === transaction.id ? <input type="text" value={transaction.description} onChange={(e) => handleEditTransaction(transaction.id, 'description', e.target.value)} className="w-full px-2 py-1 border border-fintech-border rounded text-sm" /> : <span className="text-navy text-sm">{transaction.description}</span>}</td>
                          <td className="px-3 py-3">{editingId === transaction.id ? <input type="number" step="0.01" value={transaction.amount} onChange={(e) => handleEditTransaction(transaction.id, 'amount', parseFloat(e.target.value))} className="w-24 px-2 py-1 border border-fintech-border rounded text-sm text-right" /> : <span className={`text-sm font-medium ${transaction.amount < 0 ? 'text-danger' : 'text-success'}`}>€{transaction.amount.toFixed(2)}</span>}</td>
                          <td className="px-3 py-3">{editingId === transaction.id ? <select value={transaction.category} onChange={(e) => handleEditTransaction(transaction.id, 'category', e.target.value)} className="w-full px-2 py-1 border border-fintech-border rounded text-sm">{Object.keys(CATEGORY_NAMES).map(cat => <option key={cat} value={cat}>{CATEGORY_NAMES[cat]}</option>)}</select> : getCategoryBadge(transaction.category)}</td>
                          <td className="px-3 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {editingId === transaction.id ? <button onClick={() => setEditingId(null)} className="p-1 text-success hover:bg-success/10 rounded"><CheckCircle className="w-4 h-4" /></button> : <button onClick={() => setEditingId(transaction.id)} className="p-1 text-slate hover:text-accent hover:bg-accent/10 rounded"><Edit3 className="w-4 h-4" /></button>}
                              <button onClick={() => handleDeleteTransaction(transaction.id)} className="p-1 text-slate hover:text-danger hover:bg-danger/10 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={handleAddTransaction} className="mt-4 w-full py-3 border-2 border-dashed border-fintech-border rounded-xl text-slate hover:border-success hover:text-success transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Transactie toevoegen</button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 card-shadow border border-fintech-border">
              <h3 className="font-bold text-navy mb-4">Account</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-slate">Email</span><span className="text-navy font-medium text-sm truncate max-w-[150px]">{user?.email}</span></div>
                <div className="flex justify-between"><span className="text-slate">Plan</span><span className={`font-medium text-sm ${isPro ? 'text-success' : 'text-slate'}`}>{isEnterprise ? 'Enterprise' : isPro ? 'Business' : 'Free'}</span></div>
                <div className="flex justify-between"><span className="text-slate">Credits</span><span className="text-navy font-bold">{isPro ? '∞' : '2'}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 card-shadow border border-fintech-border">
              <h3 className="font-bold text-navy mb-4">AI Intelligence</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><Brain className="w-4 h-4 text-success" /><span className="text-slate">Smart Categorisatie</span></div>
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-success" /><span className="text-slate">AI Fraude Detectie</span></div>
                <div className="flex items-center gap-2"><PieChart className="w-4 h-4 text-success" /><span className="text-slate">Business Insights</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /><span className="text-slate">Preview & Bewerken</span></div>
                {isEnterprise ? <><div className="flex items-center gap-2"><FileJson className="w-4 h-4 text-success" /><span className="text-slate">JSON Export met AI data</span></div><div className="flex items-center gap-2"><Zap className="w-4 h-4 text-success" /><span className="text-slate">API Toegang</span></div></> : <><div className="flex items-center gap-2 opacity-50"><X className="w-4 h-4 text-slate" /><span className="text-slate">JSON Export</span></div><div className="flex items-center gap-2 opacity-50"><X className="w-4 h-4 text-slate" /><span className="text-slate">API Toegang</span></div></>}
              </div>
              {!isEnterprise && <Link href="/#pricing" className="mt-4 block w-full py-2 text-center bg-navy text-white rounded-lg hover:bg-navy-light transition-colors text-sm font-medium">Upgrade naar Enterprise</Link>}
            </div>

            <div className="bg-white rounded-2xl p-6 card-shadow border border-fintech-border">
              <h3 className="font-bold text-navy mb-4">Ondersteunde Banken</h3>
              <div className="space-y-2 text-sm">
                {['ING Bank', 'Rabobank', 'ABN AMRO', 'Bunq', 'Revolut'].map((bank) => <div key={bank} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /><span className="text-slate">{bank}</span></div>)}
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /><span className="text-slate">En meer...</span></div>
              </div>
            </div>

            <div className="bg-navy rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-2">Hulp nodig?</h3>
              <p className="text-slate-light text-sm mb-4">Ons support team staat voor je klaar.</p>
              <Link href="mailto:support@bscpro.ai" className="text-success hover:text-success-light text-sm font-medium">Contact opnemen →</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
