import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, FileText, User, AlertCircle } from 'lucide-react';
import Head from 'next/head';

interface QualityFlag {
  id: string;
  user_id: string;
  file_name: string;
  confidence_score: number;
  threshold: number;
  flagged_fields: any;
  ai_suggestion: string;
  status: string;
  created_at: string;
}

export default function QualityFlagsReport() {
  const [flags, setFlags] = useState<QualityFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      const response = await fetch('/api/agents/quality/report');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setFlags(data.flags || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredFlags = flags.filter(flag => {
    if (filter === 'all') return true;
    return flag.status === filter;
  });

  const stats = {
    total: flags.length,
    open: flags.filter(f => f.status === 'open').length,
    reviewed: flags.filter(f => f.status === 'reviewed').length,
    resolved: flags.filter(f => f.status === 'resolved').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d14] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00b8d9]"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Quality Flags Report - BSC Pro Admin</title>
      </Head>
      
      <div className="min-h-screen bg-[#080d14] text-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
              Quality Flags Report
            </h1>
            <p className="text-slate-400">AI Scan Quality Monitoring</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-1">Total Flags</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-1">Open</p>
              <p className="text-3xl font-bold text-amber-500">{stats.open}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-1">Reviewed</p>
              <p className="text-3xl font-bold text-blue-500">{stats.reviewed}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-1">Resolved</p>
              <p className="text-3xl font-bold text-green-500">{stats.resolved}</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {['all', 'open', 'reviewed', 'resolved'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filter === f 
                    ? 'bg-[#00b8d9] text-[#080d14] font-semibold' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Flags List */}
          {error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-red-400">
              <AlertCircle className="w-6 h-6 mb-2" />
              {error}
            </div>
          ) : filteredFlags.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-xl text-white mb-2">Geen flags gevonden</p>
              <p className="text-slate-400">Alle scans hebben goede quality scores!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFlags.map((flag) => (
                <div key={flag.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#00b8d9]" />
                      <span className="font-semibold text-white">
                        {flag.file_name || 'Onbekend bestand'}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      flag.status === 'open' ? 'bg-amber-500/20 text-amber-400' :
                      flag.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {flag.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-800 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">Confidence Score</p>
                      <p className={`text-xl font-bold ${
                        (flag.confidence_score || 0) < 0.5 ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {Math.round((flag.confidence_score || 0) * 100)}%
                      </p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">Threshold</p>
                      <p className="text-xl font-bold text-white">
                        {Math.round((flag.threshold || 0.75) * 100)}%
                      </p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">Geflagd op</p>
                      <p className="text-sm text-white">
                        {new Date(flag.created_at).toLocaleDateString('nl-NL')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(flag.created_at).toLocaleTimeString('nl-NL')}
                      </p>
                    </div>
                  </div>

                  {/* Flagged Fields */}
                  {flag.flagged_fields && (
                    <div className="mb-4">
                      <p className="text-slate-400 text-xs mb-2">Geflagde velden:</p>
                      <div className="flex gap-2">
                        {Object.entries(flag.flagged_fields as Record<string, boolean>)
                          .filter(([_, isFlagged]) => isFlagged)
                          .map(([field]) => (
                            <span key={field} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                              {field}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* AI Suggestion */}
                  {flag.ai_suggestion && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                      <p className="text-amber-400 text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {flag.ai_suggestion}
                      </p>
                    </div>
                  )}

                  {/* User ID */}
                  <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs">
                    <User className="w-3 h-3" />
                    User ID: {flag.user_id.substring(0, 8)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
