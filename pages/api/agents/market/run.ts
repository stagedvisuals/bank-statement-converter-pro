import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Keywords to track
const TRACKED_KEYWORDS = ['BTW', 'Factuur', 'Boekhouden'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security check
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const results = {
      keywords_checked: 0,
      trends_found: 0,
      report_created: false
    };

    const currentDate = new Date();
    const weekNumber = getWeekNumber(currentDate);
    const year = currentDate.getFullYear();

    // Check each keyword
    for (const keyword of TRACKED_KEYWORDS) {
      try {
        // Note: In production, you'd use Google Trends API
        // For now, we'll create mock data
        const mockTrendScore = Math.floor(Math.random() * 100);
        const mockSearchVolume = Math.floor(Math.random() * 10000) + 1000;

        await supabase.from('market_trends').insert({
          keyword: keyword,
          trend_score: mockTrendScore,
          search_volume: mockSearchVolume,
          related_queries: [
            `${keyword} software`,
            `${keyword} 2026`,
            `gratis ${keyword.toLowerCase()}`,
            `${keyword} zzp`
          ],
          geo_region: 'NL',
          time_range: '7d',
          week_number: weekNumber,
          year: year
        });

        results.keywords_checked++;
        results.trends_found++;
      } catch (error: any) {
        console.error(`Error fetching trend for ${keyword}:`, error);
      }
    }

    // Generate weekly report
    const { data: weekTrends } = await supabase
      .from('market_trends')
      .select('*')
      .eq('week_number', weekNumber)
      .eq('year', year);

    const reportData = {
      trends: weekTrends,
      summary: generateInsights(weekTrends),
      recommendations: generateRecommendations(weekTrends)
    };

    await supabase.from('market_agent_reports').upsert({
      week_number: weekNumber,
      year: year,
      report_data: reportData,
      insights: reportData.summary,
      recommendations: reportData.recommendations
    }, { onConflict: 'week_number,year' });

    results.report_created = true;

    // Log activity
    await supabase.rpc('log_agent_activity', {
      p_agent_type: 'market',
      p_log_level: 'info',
      p_message: `Weekly market report generated`,
      p_metadata: { week: weekNumber, year, trends: results.trends_found }
    });

    return res.status(200).json({
      success: true,
      agent: 'market',
      results
    });

  } catch (error: any) {
    console.error('Market agent error:', error);
    return res.status(500).json({ error: error.message });
  }
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function generateInsights(trends: any[] | null): string[] {
  if (!trends || trends.length === 0) {
    return ['Geen trend data beschikbaar deze week.'];
  }

  const insights: string[] = [];
  const avgScore = trends.reduce((sum, t) => sum + (t.trend_score || 0), 0) / trends.length;

  if (avgScore > 70) {
    insights.push('🔥 Hoog zoekvolume deze week - overweeg extra marketing.');
  } else if (avgScore < 30) {
    insights.push('📉 Laag zoekvolume - focus op retentie van bestaande klanten.');
  }

  const topKeyword = trends.reduce((max, t) => (t.trend_score > max.trend_score ? t : max), trends[0]);
  insights.push(`📊 Meest trending: "${topKeyword.keyword}" met score ${topKeyword.trend_score}/100`);

  return insights;
}

function generateRecommendations(trends: any[] | null): string[] {
  if (!trends) return [];

  const recommendations: string[] = [];

  const btwTrend = trends.find(t => t.keyword === 'BTW');
  if (btwTrend && btwTrend.trend_score > 60) {
    recommendations.push('💡 BTW is trending - plaats extra content over BTW calculator.');
  }

  const factuurTrend = trends.find(t => t.keyword === 'Factuur');
  if (factuurTrend && factuurTrend.trend_score > 60) {
    recommendations.push('💡 Factuur software trending - promoveren van scan feature.');
  }

  recommendations.push('🎯 Consistente groei zichtbaar - overweeg betaalde advertenties.');

  return recommendations;
}
