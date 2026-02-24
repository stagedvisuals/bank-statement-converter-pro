// Transaction Categorization Engine
// Categorizes transactions based on description patterns

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  keywords: string[];
  patterns?: RegExp[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'boodschappen',
    name: 'Boodschappen',
    emoji: '🛒',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    keywords: ['albert heijn', 'ah to go', 'jumbo', 'lidl', 'aldi', 'plus', 'dirk', 'spar', 'ekoplaza', 'marqt', 'vomar', 'hoogvliet', 'dekamarkt', 'dirk van den broek', 'jan linders', 'coop', 'attent', 'poiesz', 'nettorama', 'bas van der heijden', 'kruidvat', 'etos', 'hema'],
    patterns: [/^ah\s/i, /^jumbo\s/i]
  },
  {
    id: 'huur',
    name: 'Huur / Hypotheek',
    emoji: '🏠',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    keywords: ['huur', 'hypotheek', 'woning', 'vve', 'vereniging van eigenaren', 'servicekosten'],
    patterns: [/^huur/i, /^hypotheek/i]
  },
  {
    id: 'salaris',
    name: 'Salaris',
    emoji: '💼',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    keywords: ['salaris', 'loon', 'payroll', 'uitbetaling', 'werkgever'],
    patterns: [/^salaris/i, /^loon/i, /sal\s?\d{4}/i]
  },
  {
    id: 'brandstof',
    name: 'Brandstof',
    emoji: '⛽️',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    keywords: ['shell', 'bp', 'esso', 'tinq', 'total', 'tamoil', 'gulf', 'caltex', 'makro tank', 'bvdw', 'tango', 'argos', 'ldf', 'parkeren tank'],
    patterns: [/\btank\b/i, /\bstation\b/i]
  },
  {
    id: 'horeca',
    name: 'Horeca',
    emoji: '🍽',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    keywords: ['restaurant', 'cafe', 'bar', 'lunchroom', 'cafetaria', 'snackbar', 'eethuis', 'grill', 'pizzeria', 'grand cafe', 'hotel', 'brasserie', 'bistro'],
    patterns: [/restaurant/i, /caf[eé]/i, /lunch/i, /diner/i, /terras/i]
  },
  {
    id: 'telecom',
    name: 'Telecom',
    emoji: '📱',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    keywords: ['kpn', 'vodafone', 't-mobile', 'simyo', 'tele2', 'ben', 'hollandsnieuwe', 'ziggo', 'xs4all', 'online', 'canaldigitaal', 'dishtv', 'telfort', 'kpn mobiel'],
    patterns: [/^kpn/i, /^vodafone/i, /^t-mobile/i, /^ziggo/i]
  },
  {
    id: 'transport',
    name: 'Transport',
    emoji: '🚗',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    keywords: ['ns', 'nederlandse spoorwegen', 'ov-chipkaart', 'ov pay', 'gvb', 'htm', 'ret', 'connexxion', 'qbuzz', 'arriva', 'syntus', 'keolis', 'eurostar', 'thalys', 'flixbus', 'blablacar', 'uber', 'bolt', 'felyx', 'check', 'parkeren', 'garage'],
    patterns: [/^ns\s/i, /ov-chip/i, /parkeren/i, /garage/i, /taxi/i]
  },
  {
    id: 'software',
    name: 'Software / SaaS',
    emoji: '💻',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    keywords: ['adobe', 'microsoft', 'google', 'aws', 'amazon web', 'dropbox', 'slack', 'zoom', 'notion', 'atlassian', 'github', 'gitlab', 'jetbrains', 'intuit', 'quickbooks', 'xero', 'exact', 'twinfield', 'moneybird', 'afas', 'visma', 'yuki', 'silvasoft'],
    patterns: [/software/i, /subscription/i, /licentie/i, /license/i, /saas/i]
  },
  {
    id: 'bankkosten',
    name: 'Bankkosten',
    emoji: '🏦',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    keywords: ['bankkosten', 'rente', 'kosten', 'transactiekosten', 'abonnement', 'maandkosten'],
    patterns: [/kosten/i, /rente/i, /bank/i, /^kst/i]
  },
  {
    id: 'overig',
    name: 'Overig',
    emoji: '📦',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    keywords: [],
    patterns: []
  }
];

// BTW percentages per categorie
export const BTW_RATES: Record<string, { rate: number; description: string }> = {
  'boodschappen': { rate: 9, description: 'Lage BTW tarief' },
  'horeca': { rate: 9, description: 'Lage BTW tarief' },
  'brandstof': { rate: 21, description: 'Hoge BTW tarief' },
  'telecom': { rate: 21, description: 'Hoge BTW tarief' },
  'transport': { rate: 9, description: 'Lage BTW tarief' },
  'software': { rate: 21, description: 'Hoge BTW tarief' },
  'huur': { rate: 0, description: 'BTW vrijgesteld' },
  'salaris': { rate: 0, description: 'Geen BTW van toepassing' },
  'bankkosten': { rate: 0, description: 'BTW vrijgesteld' },
  'overig': { rate: 21, description: 'Standaard tarief' }
};

/**
 * Categorizes a transaction based on its description
 */
export function categorizeTransaction(description: string): Category {
  const lowerDesc = description.toLowerCase();
  
  for (const category of CATEGORIES) {
    // Check keywords
    if (category.keywords.some(keyword => lowerDesc.includes(keyword))) {
      return category;
    }
    
    // Check patterns
    if (category.patterns?.some(pattern => pattern.test(description))) {
      return category;
    }
  }
  
  return CATEGORIES.find(c => c.id === 'overig') || CATEGORIES[CATEGORIES.length - 1];
}

/**
 * Categorizes an array of transactions
 */
export function categorizeTransactions(transactions: any[]): any[] {
  return transactions.map(tx => ({
    ...tx,
    category: categorizeTransaction(tx.omschrijving || '').id,
    categoryEmoji: categorizeTransaction(tx.omschrijving || '').emoji,
    categoryName: categorizeTransaction(tx.omschrijving || '').name,
    categoryColor: categorizeTransaction(tx.omschrijving || '').color,
    categoryBgColor: categorizeTransaction(tx.omschrijving || '').bgColor,
    btw: BTW_RATES[categorizeTransaction(tx.omschrijving || '').id] || BTW_RATES['overig']
  }));
}

/**
 * Get summary statistics per category
 */
export function getCategorySummary(transactions: any[]): any[] {
  const summary: Record<string, { count: number; total: number; category: Category }> = {};
  
  transactions.forEach(tx => {
    const catId = tx.category || 'overig';
    if (!summary[catId]) {
      summary[catId] = {
        count: 0,
        total: 0,
        category: CATEGORIES.find(c => c.id === catId) || CATEGORIES[CATEGORIES.length - 1]
      };
    }
    summary[catId].count++;
    summary[catId].total += Math.abs(tx.bedrag || 0);
  });
  
  return Object.entries(summary)
    .map(([id, data]) => ({
      id,
      ...data,
      percentage: transactions.length > 0 ? (data.count / transactions.length * 100).toFixed(1) : 0
    }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Get BTW summary for tax reporting
 */
export function getBTWSummary(transactions: any[]): any {
  const btwSummary: Record<number, { rate: number; description: string; total: number; btwAmount: number }> = {};
  
  transactions.forEach(tx => {
    const btwInfo = tx.btw || BTW_RATES['overig'];
    const rate = btwInfo.rate;
    
    if (!btwSummary[rate]) {
      btwSummary[rate] = {
        rate,
        description: btwInfo.description,
        total: 0,
        btwAmount: 0
      };
    }
    
    const amount = Math.abs(tx.bedrag || 0);
    btwSummary[rate].total += amount;
    // BTW berekening: bedrag is inclusief BTW, dus BTW = bedrag * rate / (100 + rate)
    btwSummary[rate].btwAmount += amount * rate / (100 + rate);
  });
  
  return Object.entries(btwSummary).map(([rate, data]) => ({
    ...data,
    btwAmountFormatted: data.btwAmount.toFixed(2)
  }));
}
