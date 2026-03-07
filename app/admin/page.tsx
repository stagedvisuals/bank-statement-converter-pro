"use client"

import { useState, useEffect } from 'react'
import { 
  Activity, 
  TrendingUp, 
  FileText, 
  CreditCard,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  LogOut,
  Shield
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [kpiData, setKpiData] = useState<any>(null)
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [queryUsed, setQueryUsed] = useState<string>('')
  const [userRole, setUserRole] = useState<string>('')
  const [isAdmin, setIsAdmin] = useState(false)
  
  const router = useRouter()

  const checkAdminRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return false
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()
      
      if (profile?.role === 'admin') {
        setUserRole('admin')
        setIsAdmin(true)
        return true
      } else {
        setError('Geen admin rechten')
        setIsAdmin(false)
        return false
      }
    } catch (err) {
      setError('Fout bij authenticatie')
      return false
    }
  }

  const fetchAnalyticsData = async () => {
    if (!isAdmin) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Get session token for API call
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Geen sessie gevonden')
      }
      
      const res = await fetch('/api/admin/analytics', {
        headers: { 
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }
      
      const data = await res.json()
      setKpiData(data.kpis)
      setActivityLogs(data.activity_logs || [])
      setQueryUsed(data.query_used || '')
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    const init = async () => {
      const isAdminUser = await checkAdminRole()
      if (isAdminUser) {
        await fetchAnalyticsData()
      }
    }
    init()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500'
    if (score >= 80) return 'text-amber-500'
    return 'text-destructive'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/20'
    if (score >= 80) return 'bg-amber-500/20'
    return 'bg-destructive/20'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00b8d9] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Admin dashboard laden...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-destructive mb-2">Toegang Geweigerd</h2>
            <p className="text-muted-foreground mb-6">
              Je hebt geen admin rechten om deze pagina te bekijken.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90"
            >
              <LogOut className="w-4 h-4 inline mr-2" />
              Uitloggen
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Real-time inzichten in BSC Pro activiteiten • Rol: <span className="font-medium text-[#00b8d9]">{userRole}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm"
        >
          <LogOut className="w-4 h-4" />
          Uitloggen
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 text-destructive mb-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">Error loading analytics</h3>
          </div>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="mt-3 px-4 py-2 bg-destructive/20 text-destructive rounded-lg text-sm hover:bg-destructive/30"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Scans vandaag</p>
            <FileText className="w-5 h-5 text-[#00b8d9]" />
          </div>
          <p className="text-3xl font-bold">{kpiData?.scans_today || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {kpiData?.scans_month || 0} deze maand
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">AI Confidence Score</p>
            <TrendingUp className="w-5 h-5 text-[#00b8d9]" />
          </div>
          <p className={`text-3xl font-bold ${getScoreColor(kpiData?.avg_confidence_score || 0)}`}>
            {kpiData?.avg_confidence_score ? `${kpiData.avg_confidence_score}%` : 'N/A'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Gemiddelde score van alle scans
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Uitstaande Credits</p>
            <CreditCard className="w-5 h-5 text-[#00b8d9]" />
          </div>
          <p className="text-3xl font-bold">{kpiData?.total_outstanding_credits || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Totaal bij alle gebruikers
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Live Activiteiten</p>
            <Activity className="w-5 h-5 text-[#00b8d9]" />
          </div>
          <p className="text-3xl font-bold">{activityLogs.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Recente acties
          </p>
        </div>
      </div>

      {/* Live Activiteiten Tabel */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-foreground">Live Activiteiten Logboek</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Recente scans en credit transacties (alleen scan_success)
            </p>
          </div>
          <button
            onClick={fetchAnalyticsData}
            className="flex items-center gap-2 px-4 py-2 bg-[#00b8d9] text-[#080d14] rounded-lg font-medium hover:bg-[#00b8d9]/90"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Datum/Tijd</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Gebruiker</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Bank</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Score</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Credits</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <tr key={log.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-foreground">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="p-4 font-medium text-foreground">{log.user_email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
                        log.status === 'success' 
                          ? 'bg-emerald-500/20 text-emerald-600' 
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {log.status === 'success' ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Succes
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Fout
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-foreground">{log.bank}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getScoreBgColor(log.confidence_score)} ${getScoreColor(log.confidence_score)}`}>
                        {log.confidence_score ? `${log.confidence_score}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-foreground">
                      {log.credits_deducted > 0 ? `-${log.credits_deducted}` : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Geen activiteiten gevonden. Controleer of de credit_logs tabel bestaat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL Query Bewijs */}
      {queryUsed && (
        <div className="bg-muted/50 border border-border rounded-xl p-6">
          <h4 className="font-medium mb-3 text-foreground">📊 Supabase Query Bewijs</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Dit is de exacte query die gebruikt wordt om de activiteiten log op te halen:
          </p>
          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto font-mono text-foreground">
            {queryUsed}
          </pre>
          <p className="text-sm text-muted-foreground mt-4">
            Deze query voegt de <code className="bg-muted px-1 py-0.5 rounded text-xs">credit_logs</code> tabel samen met de <code className="bg-muted px-1 py-0.5 rounded text-xs">profiles</code> tabel 
            om gebruikers e-mails te tonen en filtert op <code className="bg-muted px-1 py-0.5 rounded text-xs">action_type = 'scan_success'</code>.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>BSC Pro Admin Dashboard • Beveiligd via Supabase Role Check • Laatste update: {new Date().toLocaleString('nl-NL')}</p>
      </div>
    </div>
  )
}
