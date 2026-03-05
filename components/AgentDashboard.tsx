import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

interface AgentStats {
  totalJobs24h: number;
  openQualityFlags: number;
  activeRetentionFlows: number;
  latestMarketReport: {
    week: number;
    year: number;
    insights: string[];
    recommendations: string[];
  } | null;
}

interface QualityFlag {
  id: string;
  user_id: string;
  file_name: string;
  confidence_score: number;
  ai_suggestion: string;
  created_at: string;
}

export default function AgentDashboard() {
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [qualityFlags, setQualityFlags] = useState<QualityFlag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const session = localStorage.getItem('bscpro_session');
      if (!session) return;

      const { access_token } = JSON.parse(session);
      const response = await fetch('/api/agents/dashboard', {
        headers: { 'Authorization': `Bearer ${access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.dashboard.stats);
        setQualityFlags(data.dashboard.qualityFlags);
      }
    } catch (error) {
      console.error('Error fetching agent dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="w-8 h-8 text-[#00b8d9] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="w-6 h-6 text-[#00b8d9]" />
          🤖 Multi-Agent Systeem
        </h2>
        <span className="text-sm text-muted-foreground">Live Monitoring</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Onboarding Agent */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-foreground">Onboarding Agent</h3>
            </div>
            <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full">Actief</span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">
            {stats?.activeRetentionFlows || 0}
          </p>
          <p className="text-sm text-muted-foreground">Actieve retention flows</p>
          <div className="mt-4 text-xs text-muted-foreground">
            Checkt elke 6 uur op users die vastzitten
          </div>
        </div>

        {/* Quality Agent */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-foreground">Quality Agent</h3>
            </div>
            <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded-full">{stats?.openQualityFlags || 0} flags</span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">
            {stats?.openQualityFlags || 0}
          </p>
          <p className="text-sm text-muted-foreground">Open quality flags</p>
          <div className="mt-4 text-xs text-muted-foreground">
            Checkt elke 4 uur scan kwaliteit
          </div>
        </div>

        {/* Market Agent */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-foreground">Market Agent</h3>
            </div>
            <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full">Weekly</span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">
            {stats?.latestMarketReport ? `Week ${stats.latestMarketReport.week}` : '—'}
          </p>
          <p className="text-sm text-muted-foreground">
            {stats?.latestMarketReport ? 'Laatste rapport' : 'Geen rapport'}
          </p>
          <div className="mt-4 text-xs text-muted-foreground">
            Checkt maandag 9:00 Google Trends
          </div>
        </div>
      </div>

      {/* Latest Market Report */}
      {stats?.latestMarketReport && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00b8d9]" />
            📊 Markt Rapport Week {stats.latestMarketReport.week}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Insights</h4>
              <ul className="space-y-2">
                {stats.latestMarketReport.insights?.map((insight, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Aanbevelingen</h4>
              <ul className="space-y-2">
                {stats.latestMarketReport.recommendations?.map((rec, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#00b8d9] mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quality Flags */}
      {qualityFlags.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            ⚠️ Quality Flags (Laatste 10)
          </h3>
          <div className="space-y-3">
            {qualityFlags.map((flag) => (
              <div key={flag.id} className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{flag.file_name || 'Onbekend bestand'}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    flag.confidence_score < 0.5 ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {Math.round((flag.confidence_score || 0) * 100)}% confidence
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{flag.ai_suggestion}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(flag.created_at).toLocaleDateString('nl-NL')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Schedule */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">⏰ Agent Schema</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-sm text-foreground">Onboarding Agent</span>
            </div>
            <span className="text-sm text-muted-foreground">Elke 6 uur</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-foreground">Quality Agent</span>
            </div>
            <span className="text-sm text-muted-foreground">Elke 4 uur</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-foreground">Market Agent</span>
            </div>
            <span className="text-sm text-muted-foreground">Maandag 9:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
