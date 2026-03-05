import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Tag, Percent, Hash, Sparkles, Search } from 'lucide-react';

interface CategorizationRule {
  id: string;
  user_id: string;
  keyword: string;
  grootboek_code: string;
  btw_percentage: string;
  category_name: string | null;
  match_type: 'contains' | 'starts_with' | 'ends_with' | 'exact';
  priority: number;
  is_active: boolean;
}

export default function SmartRulesManager() {
  const [rules, setRules] = useState<CategorizationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState<{
    keyword: string;
    grootboek_code: string;
    btw_percentage: string;
    category_name: string;
    match_type: 'contains' | 'starts_with' | 'ends_with' | 'exact';
    priority: number;
  }>({
    keyword: '',
    grootboek_code: '',
    btw_percentage: '21',
    category_name: '',
    match_type: 'contains',
    priority: 100,
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/categorization/rules');
      if (response.ok) {
        const data = await response.json();
        setRules(data.rules || []);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/categorization/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchRules();
        setShowAddForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding rule:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/categorization/rules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchRules();
        setEditingId(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating rule:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze regel wilt verwijderen?')) return;

    try {
      const response = await fetch(`/api/categorization/rules/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchRules();
      }
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const startEdit = (rule: CategorizationRule) => {
    setFormData({
      keyword: rule.keyword,
      grootboek_code: rule.grootboek_code,
      btw_percentage: rule.btw_percentage,
      category_name: rule.category_name || '',
      match_type: rule.match_type,
      priority: rule.priority,
    });
    setEditingId(rule.id);
  };

  const resetForm = () => {
    setFormData({
      keyword: '',
      grootboek_code: '',
      btw_percentage: '21',
      category_name: '',
      match_type: 'contains',
      priority: 100,
    });
  };

  const filteredRules = rules.filter(rule =>
    rule.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.grootboek_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b8d9]"></div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#00b8d9]" />
          <div>
            <h3 className="text-xl font-semibold text-foreground">Slimme Regels</h3>
            <p className="text-sm text-muted-foreground">
              {rules.length} {rules.length === 1 ? 'regel' : 'regels'} actief
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00b8d9] text-[#080d14] rounded-lg font-medium hover:shadow-[0_0_20px_rgba(0,184,217,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Regel
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Zoek regels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-foreground text-sm"
        />
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleSubmit} className="mb-6 p-4 bg-secondary rounded-lg border border-border">
          <h4 className="font-semibold text-foreground mb-4">
            {editingId ? 'Regel Bewerken' : 'Nieuwe Regel Toevoegen'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                <Tag className="w-3 h-3 inline mr-1" />
                Zoekterm / Keyword
              </label>
              <input
                type="text"
                placeholder="bijv. NS Reizigers"
                value={formData.keyword}
                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                <Hash className="w-3 h-3 inline mr-1" />
                Grootboekrekening
              </label>
              <input
                type="text"
                placeholder="bijv. 4200"
                value={formData.grootboek_code}
                onChange={(e) => setFormData({ ...formData, grootboek_code: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                <Percent className="w-3 h-3 inline mr-1" />
                BTW Percentage
              </label>
              <select
                value={formData.btw_percentage}
                onChange={(e) => setFormData({ ...formData, btw_percentage: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground text-sm"
              >
                <option value="21">21% - Hoog tarief</option>
                <option value="9">9% - Laag tarief</option>
                <option value="0">0% - Geen BTW</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Categorie (optioneel)
              </label>
              <input
                type="text"
                placeholder="bijv. Vervoer"
                value={formData.category_name}
                onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground text-sm"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-[#00b8d9] text-[#080d14] rounded-lg font-medium"
            >
              <Save className="w-4 h-4" />
              {editingId ? 'Opslaan' : 'Toevoegen'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                resetForm();
              }}
              className="flex items-center gap-2 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-secondary"
            >
              <X className="w-4 h-4" />
              Annuleren
            </button>
          </div>
        </form>
      )}

      {/* Rules List */}
      <div className="space-y-2">
        {filteredRules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'Geen regels gevonden voor deze zoekterm' : 'Nog geen slimme regels. Voeg je eerste regel toe!'}
          </div>
        ) : (
          filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border hover:border-[#00b8d9]/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground">{rule.keyword}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-[#00b8d9] font-medium">{rule.grootboek_code}</span>
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-[#00b8d9] text-xs rounded-full">
                    {rule.btw_percentage}%
                  </span>
                  {rule.category_name && (
                    <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded-full border border-border">
                      {rule.category_name}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Match: {rule.match_type === 'contains' ? 'Bevat' : rule.match_type}
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => startEdit(rule)}
                  className="p-2 text-muted-foreground hover:text-[#00b8d9] hover:bg-cyan-500/10 rounded-lg transition-colors"
                  title="Bewerken"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Verwijderen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
        <h5 className="font-medium text-foreground mb-2">💡 Tips voor Slimme Regels</h5>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Gebruik unieke zoektermen die in de transactieomschrijving voorkomen</li>
          <li>• Kortere termen werken beter dan hele zinnen</li>
          <li>• De standaardregels dekken veel voorkomende uitgaven</li>
          <li>• Je kunt altijd regels aanpassen als de categorisatie niet klopt</li>
        </ul>
      </div>
    </div>
  );
}
