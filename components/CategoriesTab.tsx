'use client';

import { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Database } from 'lucide-react';

interface Correction {
  id: string;
  keyword: string;
  categorie: string;
  subcategorie: string;
  btw: string;
  icon: string;
  gebruik_count: number;
  created_at: string;
}

export default function CategoriesTab() {
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  const fetchCorrections = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/corrections');
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setCorrections(data || []);
    } catch (err) {
      setError('Kon correcties niet laden');
    } finally {
      setLoading(false);
    }
  };

  const deleteCorrection = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze correctie wilt verwijderen?')) return;
    
    try {
      const response = await fetch(`/api/admin/corrections?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      setCorrections(corrections.filter(c => c.id !== id));
    } catch (err) {
      setError('Kon correctie niet verwijderen');
    }
  };

  useEffect(() => {
    fetchCorrections();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-[#00b8d9]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Database className="w-5 h-5 text-[#00b8d9]" />
            🧠 Community Categorieën
          </h2>
          <p className="text-sm text-muted-foreground">
            {corrections.length} geleerde patronen van gebruikers
          </p>
        </div>
        <button
          onClick={fetchCorrections}
          className="flex items-center gap-2 px-4 py-2 text-muted-foreground border border-border rounded-lg hover:text-foreground"
        >
          <RefreshCw className="w-4 h-4" />
          Vernieuwen
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="text-left p-3">Keyword</th>
                <th className="text-left p-3">Categorie</th>
                <th className="text-left p-3 hidden md:table-cell">Subcategorie</th>
                <th className="text-left p-3 hidden md:table-cell">BTW</th>
                <th className="text-right p-3">Gebruik</th>
                <th className="text-right p-3">Actie</th>
              </tr>
            </thead>
            <tbody>
              {corrections.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{c.keyword}</td>
                  <td className="p-3">
                    <span className="flex items-center gap-2">
                      <span>{c.icon || '📋'}</span>
                      <span className="text-sm">{c.categorie}</span>
                    </span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">
                    {c.subcategorie || '-'}
                  </td>
                  <td className="p-3 text-xs hidden md:table-cell">{c.btw}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs">
                      {c.gebruik_count}x
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => deleteCorrection(c.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      title="Verwijderen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {corrections.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nog geen community correcties</p>
          <p className="text-sm mt-2">
            Gebruikers kunnen categorieën corrigeren in hun dashboard
          </p>
        </div>
      )}
    </div>
  );
}
