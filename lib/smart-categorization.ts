import { createClient } from '@supabase/supabase-js';

// Types
type CategorizationRule = {
  id: string;
  user_id: string;
  keyword: string;
  grootboek_code: string;
  btw_percentage: string;
  category_name: string | null;
  match_type: 'contains' | 'starts_with' | 'ends_with' | 'exact';
  priority: number;
};

type ClassificationResult = {
  rule_id: string | null;
  grootboek_code: string | null;
  btw_percentage: string | null;
  category_name: string | null;
  matched_keyword: string | null;
  confidence_score: number;
  method: 'rule_match' | 'llm_predicted' | 'manual' | 'none';
};

type Transaction = {
  id?: string;
  datum: string;
  omschrijving: string;
  bedrag: number;
  tegenrekening?: string;
  [key: string]: any;
};

export class SmartCategorizationEngine {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Haal alle actieve categorisatie regels op voor een gebruiker
   */
  async getRulesForUser(userId: string): Promise<CategorizationRule[]> {
    const { data, error } = await this.supabase
      .from('categorization_rules')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (error) {
      console.error('[SmartCategorization] Error fetching rules:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Analyseer een enkele transactie en classificeer deze
   */
  async classifyTransaction(
    transaction: Transaction,
    userId: string
  ): Promise<ClassificationResult> {
    const rules = await this.getRulesForUser(userId);
    
    // Zoek naar een matchende regel (hoogste prioriteit eerst)
    for (const rule of rules) {
      if (this.matchesRule(transaction.omschrijving, rule)) {
        return {
          rule_id: rule.id,
          grootboek_code: rule.grootboek_code,
          btw_percentage: rule.btw_percentage,
          category_name: rule.category_name,
          matched_keyword: rule.keyword,
          confidence_score: 0.95, // Harde match = hoge confidence
          method: 'rule_match',
        };
      }
    }

    // Geen match gevonden
    return {
      rule_id: null,
      grootboek_code: null,
      btw_percentage: null,
      category_name: null,
      matched_keyword: null,
      confidence_score: 0,
      method: 'none',
    };
  }

  /**
   * Check of een omschrijving matched met een regel
   */
  private matchesRule(omschrijving: string, rule: CategorizationRule): boolean {
    const text = omschrijving.toLowerCase();
    const keyword = rule.keyword.toLowerCase();

    switch (rule.match_type) {
      case 'exact':
        return text === keyword;
      case 'starts_with':
        return text.startsWith(keyword);
      case 'ends_with':
        return text.endsWith(keyword);
      case 'contains':
      default:
        return text.includes(keyword);
    }
  }

  /**
   * Analyseer meerdere transacties in batch
   */
  async classifyTransactions(
    transactions: Transaction[],
    userId: string
  ): Promise<Map<string, ClassificationResult>> {
    const results = new Map<string, ClassificationResult>();
    
    // Cache regels voor deze batch
    const rules = await this.getRulesForUser(userId);

    for (const transaction of transactions) {
      const classification = await this.classifyTransactionWithRules(
        transaction,
        rules
      );
      
      if (transaction.id) {
        results.set(transaction.id, classification);
      }
    }

    return results;
  }

  /**
   * Interne methode die gebruik maakt van gecachete regels
   */
  private async classifyTransactionWithRules(
    transaction: Transaction,
    rules: CategorizationRule[]
  ): Promise<ClassificationResult> {
    for (const rule of rules) {
      if (this.matchesRule(transaction.omschrijving, rule)) {
        return {
          rule_id: rule.id,
          grootboek_code: rule.grootboek_code,
          btw_percentage: rule.btw_percentage,
          category_name: rule.category_name,
          matched_keyword: rule.keyword,
          confidence_score: 0.95,
          method: 'rule_match',
        };
      }
    }

    return {
      rule_id: null,
      grootboek_code: null,
      btw_percentage: null,
      category_name: null,
      matched_keyword: null,
      confidence_score: 0,
      method: 'none',
    };
  }

  /**
   * Sla classificatie op in database (audit trail)
   */
  async saveClassification(
    transactionId: string,
    userId: string,
    classification: ClassificationResult
  ): Promise<void> {
    const { error } = await this.supabase
      .from('transaction_classifications')
      .insert({
        transaction_id: transactionId,
        user_id: userId,
        rule_id: classification.rule_id,
        grootboek_code: classification.grootboek_code,
        btw_percentage: classification.btw_percentage,
        category_name: classification.category_name,
        classification_method: classification.method,
        confidence_score: classification.confidence_score,
        matched_keyword: classification.matched_keyword,
      });

    if (error) {
      console.error('[SmartCategorization] Error saving classification:', error);
    }
  }

  /**
   * Voeg een nieuwe categorisatie regel toe
   */
  async addRule(
    userId: string,
    keyword: string,
    grootboekCode: string,
    btwPercentage: string,
    options: {
      categoryName?: string;
      matchType?: 'contains' | 'starts_with' | 'ends_with' | 'exact';
      priority?: number;
    } = {}
  ): Promise<{ success: boolean; rule?: CategorizationRule; error?: string }> {
    const { data, error } = await this.supabase
      .from('categorization_rules')
      .insert({
        user_id: userId,
        keyword: keyword.trim(),
        grootboek_code: grootboekCode.trim(),
        btw_percentage: btwPercentage,
        category_name: options.categoryName || null,
        match_type: options.matchType || 'contains',
        priority: options.priority || 100,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('[SmartCategorization] Error adding rule:', error);
      return { success: false, error: error.message };
    }

    return { success: true, rule: data };
  }

  /**
   * Update een bestaande regel
   */
  async updateRule(
    ruleId: string,
    userId: string,
    updates: Partial<Omit<CategorizationRule, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from('categorization_rules')
      .update(updates)
      .eq('id', ruleId)
      .eq('user_id', userId);

    if (error) {
      console.error('[SmartCategorization] Error updating rule:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Verwijder (soft delete) een regel
   */
  async deleteRule(
    ruleId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from('categorization_rules')
      .update({ is_active: false })
      .eq('id', ruleId)
      .eq('user_id', userId);

    if (error) {
      console.error('[SmartCategorization] Error deleting rule:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Kopieer default regels naar een nieuwe gebruiker
   */
  async copyDefaultRulesToUser(userId: string): Promise<void> {
    // Haal default regels op
    const { data: defaultRules, error: fetchError } = await this.supabase
      .from('default_categorization_rules')
      .select('*')
      .eq('is_active', true);

    if (fetchError || !defaultRules || defaultRules.length === 0) {
      console.error('[SmartCategorization] No default rules found');
      return;
    }

    // Kopieer naar gebruiker
    const userRules = defaultRules.map((rule) => ({
      user_id: userId,
      keyword: rule.keyword,
      grootboek_code: rule.grootboek_code,
      btw_percentage: rule.btw_percentage,
      category_name: rule.category_name,
      match_type: rule.match_type,
      priority: rule.priority,
      is_active: true,
    }));

    const { error: insertError } = await this.supabase
      .from('categorization_rules')
      .insert(userRules);

    if (insertError) {
      console.error('[SmartCategorization] Error copying default rules:', insertError);
    }
  }

  /**
   * Genereer statistieken over categorisatie
   */
  async getStatistics(userId: string): Promise<{
    totalRules: number;
    activeRules: number;
    topCategories: { category: string; count: number }[];
  }> {
    // Totaal aantal regels
    const { count: totalRules } = await this.supabase
      .from('categorization_rules')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Actieve regels
    const { count: activeRules } = await this.supabase
      .from('categorization_rules')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_active', true);

    // Top categorieën
    const { data: categories } = await this.supabase
      .from('categorization_rules')
      .select('category_name')
      .eq('user_id', userId)
      .eq('is_active', true);

    const categoryCounts: { [key: string]: number } = {};
    categories?.forEach((c) => {
      const cat = c.category_name || 'Overig';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRules: totalRules || 0,
      activeRules: activeRules || 0,
      topCategories,
    };
  }
}

export default SmartCategorizationEngine;
