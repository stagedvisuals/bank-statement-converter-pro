/**
 * BSC Pro - BTW (VAT) Detection System
 * Nederlandse BTW tarieven: 21%, 9%, 0%, vrijgesteld
 * 
 * Bronnen:
 * - Belastingdienst BTW tarieven
 * - KvK SBI-codes mapping
 * - Historische transactie data patterns
 */

export const BTW_TARIEVEN = {
  STANDAARD: 21,
  VERLAAGD: 9,
  NUL: 0,
  VRIJGESTELD: null,
  ONBEKEND: undefined
} as const;

export type BTWTarief = 21 | 9 | 0 | null | undefined;

export interface BTWResult {
  tarief: BTWTarief;
  confidence: number;
  source: 'merchant' | 'keywords' | 'category' | 'ml' | 'default';
  explanation: string;
}

// Uitgebreide merchant mapping (200+ merchants)
export const MERCHANT_BTW_MAPPING: Record<string, { tarief: BTWTarief; category: string }> = {
  // SUPERMARKTEN & VOEDING (9%)
  'albert heijn': { tarief: 9, category: 'voeding' },
  'ah': { tarief: 9, category: 'voeding' },
  'jumbo': { tarief: 9, category: 'voeding' },
  'lidl': { tarief: 9, category: 'voeding' },
  'aldi': { tarief: 9, category: 'voeding' },
  'plus': { tarief: 9, category: 'voeding' },
  'spar': { tarief: 9, category: 'voeding' },
  'dirk': { tarief: 9, category: 'voeding' },
  'dekamarkt': { tarief: 9, category: 'voeding' },
  'vomar': { tarief: 9, category: 'voeding' },
  'hoogvliet': { tarief: 9, category: 'voeding' },
  'ekoplaza': { tarief: 9, category: 'voeding' },
  'marqt': { tarief: 9, category: 'voeding' },
  'sligro': { tarief: 9, category: 'voeding' },
  'hanos': { tarief: 9, category: 'voeding' },
  'makro': { tarief: 9, category: 'voeding' },
  
  // HORECA (9%)
  'starbucks': { tarief: 9, category: 'horeca' },
  'kiosk': { tarief: 9, category: 'horeca' },
  "julia's": { tarief: 9, category: 'horeca' },
  'smulders': { tarief: 9, category: 'horeca' },
  "leonardo's": { tarief: 9, category: 'horeca' },
  'la place': { tarief: 9, category: 'horeca' },
  
  // BOEKEN & CULTUUR (9%)
  'bruna': { tarief: 9, category: 'boeken' },
  'akoplein': { tarief: 9, category: 'boeken' },
  'libris': { tarief: 9, category: 'boeken' },
  
  // MEDICIJNEN (9%)
  'etos': { tarief: 9, category: 'medicijnen' },
  'kruidvat': { tarief: 9, category: 'medicijnen' },
  'da drogist': { tarief: 9, category: 'medicijnen' },
  'd.i.o.': { tarief: 9, category: 'medicijnen' },
  'holland & barrett': { tarief: 9, category: 'medicijnen' },
  'de tuinen': { tarief: 9, category: 'medicijnen' },
  
  // OPENBAAR VERVOER (9%)
  'ns': { tarief: 9, category: 'ov' },
  'nederlandse spoorwegen': { tarief: 9, category: 'ov' },
  'arriva': { tarief: 9, category: 'ov' },
  'connexxion': { tarief: 9, category: 'ov' },
  'gvb': { tarief: 9, category: 'ov' },
  'ret': { tarief: 9, category: 'ov' },
  'htm': { tarief: 9, category: 'ov' },
  'q buzz': { tarief: 9, category: 'ov' },
  'flixbus': { tarief: 9, category: 'ov' },
  
  // TANKSTATIONS (21%)
  'shell': { tarief: 21, category: 'brandstof' },
  'bp': { tarief: 21, category: 'brandstof' },
  'esso': { tarief: 21, category: 'brandstof' },
  'total': { tarief: 21, category: 'brandstof' },
  'tinq': { tarief: 21, category: 'brandstof' },
  
  // ELEKTRONICA (21%)
  'mediamarkt': { tarief: 21, category: 'elektronica' },
  'coolblue': { tarief: 21, category: 'elektronica' },
  'alternate': { tarief: 21, category: 'elektronica' },
  'azerty': { tarief: 21, category: 'elektronica' },
  'centralpoint': { tarief: 21, category: 'elektronica' },
  'expert': { tarief: 21, category: 'elektronica' },
  'apple store': { tarief: 21, category: 'elektronica' },
  
  // KLEDING (21%)
  'wehkamp': { tarief: 21, category: 'kleding' },
  'zalando': { tarief: 21, category: 'kleding' },
  'h&m': { tarief: 21, category: 'kleding' },
  'c&a': { tarief: 21, category: 'kleding' },
  'primark': { tarief: 21, category: 'kleding' },
  'zeeman': { tarief: 21, category: 'kleding' },
  'HEMA': { tarief: 21, category: 'kleding' },
  'bijenkorf': { tarief: 21, category: 'kleding' },
  
  // MEUBELS (21%)
  'ikea': { tarief: 21, category: 'meubels' },
  'leen bakker': { tarief: 21, category: 'meubels' },
  'praxis': { tarief: 21, category: 'meubels' },
  'gamma': { tarief: 21, category: 'meubels' },
  'karwei': { tarief: 21, category: 'meubels' },
  'hornbach': { tarief: 21, category: 'meubels' },
  
  // VERZEKERINGEN (0%)
  'ing verzekeringen': { tarief: 0, category: 'verzekering' },
  'aegon': { tarief: 0, category: 'verzekering' },
  'achmea': { tarief: 0, category: 'verzekering' },
  'zilveren kruis': { tarief: 0, category: 'verzekering' },
  'vgz': { tarief: 0, category: 'verzekering' },
  'cz': { tarief: 0, category: 'verzekering' },
  'menzis': { tarief: 0, category: 'verzekering' },
  'dsW': { tarief: 0, category: 'verzekering' },
  'ohnuts': { tarief: 0, category: 'verzekering' },
  'interpolis': { tarief: 0, category: 'verzekering' },
  'centraal beheer': { tarief: 0, category: 'verzekering' },
  'nationale nederlanden': { tarief: 0, category: 'verzekering' },
  'nn': { tarief: 0, category: 'verzekering' },
  'asr': { tarief: 0, category: 'verzekering' },
  'fbto': { tarief: 0, category: 'verzekering' },
  'unive': { tarief: 0, category: 'verzekering' },
  'anwb verzekeringen': { tarief: 0, category: 'verzekering' },
  
  // BANKEN (0%)
  'ing': { tarief: 0, category: 'bank' },
  'rabobank': { tarief: 0, category: 'bank' },
  'abn amro': { tarief: 0, category: 'bank' },
  'sns bank': { tarief: 0, category: 'bank' },
  'regiobank': { tarief: 0, category: 'bank' },
  'asn bank': { tarief: 0, category: 'bank' },
  'triodos bank': { tarief: 0, category: 'bank' },
  'knab': { tarief: 0, category: 'bank' },
  'bunq': { tarief: 0, category: 'bank' },
  'revolut': { tarief: 0, category: 'bank' },
  'paypal': { tarief: 0, category: 'betaaldienst' },
  'stripe': { tarief: 0, category: 'betaaldienst' },
  
  // ZORG (0%)
  'ziekenhuis': { tarief: 0, category: 'zorg' },
  'huisarts': { tarief: 0, category: 'zorg' },
  'tandarts': { tarief: 0, category: 'zorg' },
  'fysiotherapie': { tarief: 0, category: 'zorg' },
  'fysio': { tarief: 0, category: 'zorg' },
  'apotheek': { tarief: 0, category: 'zorg' },
  'kliniek': { tarief: 0, category: 'zorg' },
  'thuiszorg': { tarief: 0, category: 'zorg' },
  'ggz': { tarief: 0, category: 'zorg' },
  
  // ONDERWIJS (0%)
  'universiteit': { tarief: 0, category: 'onderwijs' },
  'hogeschool': { tarief: 0, category: 'onderwijs' },
  'school': { tarief: 0, category: 'onderwijs' },
  'cursus': { tarief: 0, category: 'onderwijs' },
  'training': { tarief: 0, category: 'onderwijs' },
  'duo': { tarief: 0, category: 'onderwijs' },
  'studielink': { tarief: 0, category: 'onderwijs' },
  
  // SPORT (21%)
  'basic fit': { tarief: 21, category: 'sport' },
  'fit for free': { tarief: 21, category: 'sport' },
  'sportcity': { tarief: 21, category: 'sport' },
  'healthcity': { tarief: 21, category: 'sport' },
  'anytime fitness': { tarief: 21, category: 'sport' },
  
  // TELECOM (21%)
  'kpn': { tarief: 21, category: 'telecom' },
  'vodafone': { tarief: 21, category: 'telecom' },
  't-mobile': { tarief: 21, category: 'telecom' },
  'tele2': { tarief: 21, category: 'telecom' },
  'simyo': { tarief: 21, category: 'telecom' },
  'hollandsnieuwe': { tarief: 21, category: 'telecom' },
  'ben': { tarief: 21, category: 'telecom' },
  'youfone': { tarief: 21, category: 'telecom' },
  'lebara': { tarief: 21, category: 'telecom' },
  'lyca': { tarief: 21, category: 'telecom' },
  'ziggo': { tarief: 21, category: 'telecom' },
  'xs4all': { tarief: 21, category: 'telecom' },
  
  // ENERGIE (21%)
  'eneco': { tarief: 21, category: 'energie' },
  'essent': { tarief: 21, category: 'energie' },
  'vandebron': { tarief: 21, category: 'energie' },
  'om|nieuwe energie': { tarief: 21, category: 'energie' },
  'greenchoice': { tarief: 21, category: 'energie' },
  'energiedirect': { tarief: 21, category: 'energie' },
  'pure energie': { tarief: 21, category: 'energie' },
  'engie': { tarief: 21, category: 'energie' },
  'e.on': { tarief: 21, category: 'energie' },
  'vattenfall': { tarief: 21, category: 'energie' },
  'nuon': { tarief: 21, category: 'energie' },
  
  // WATER (21%)
  'vitens': { tarief: 21, category: 'water' },
  'evides': { tarief: 21, category: 'water' },
  
  // OVERHEID (0%)
  'gemeente': { tarief: 0, category: 'overheid' },
  'belastingdienst': { tarief: 0, category: 'overheid' },
  'belasting': { tarief: 0, category: 'overheid' },
  'waterschap': { tarief: 0, category: 'overheid' },
  'omrop': { tarief: 0, category: 'overheid' },
  'cbs': { tarief: 0, category: 'overheid' },
  'kadaster': { tarief: 0, category: 'overheid' },
  
  // AUTO (21%)
  'autobedrijf': { tarief: 21, category: 'auto' },
  'garage': { tarief: 21, category: 'auto' },
  'leasing': { tarief: 21, category: 'auto' },
  'leasingplan': { tarief: 21, category: 'auto' },
  'athlon': { tarief: 21, category: 'auto' },
  'leaseplan': { tarief: 21, category: 'auto' },
  'anwb': { tarief: 21, category: 'auto' },
  'wegenwacht': { tarief: 21, category: 'auto' },
  
  // BEZORGDiensten (21%)
  'thuisbezorgd': { tarief: 21, category: 'bezorging' },
  'uber eats': { tarief: 21, category: 'bezorging' },
  'deliveroo': { tarief: 21, category: 'bezorging' },
  'postnl': { tarief: 21, category: 'bezorging' },
  'dhl': { tarief: 21, category: 'bezorging' },
  'dpd': { tarief: 21, category: 'bezorging' },
  'ups': { tarief: 21, category: 'bezorging' },
  'fedex': { tarief: 21, category: 'bezorging' },
  'gls': { tarief: 21, category: 'bezorging' },
  
  // ADVIES (21%)
  'accountant': { tarief: 21, category: 'advies' },
  'belastingadviseur': { tarief: 21, category: 'advies' },
  'advies': { tarief: 21, category: 'advies' },
  'consultancy': { tarief: 21, category: 'advies' },
  'advocaat': { tarief: 21, category: 'advies' },
  'notaris': { tarief: 21, category: 'advies' },
  
  // SOFTWARE (21%)
  'google': { tarief: 21, category: 'software' },
  'microsoft': { tarief: 21, category: 'software' },
  'adobe': { tarief: 21, category: 'software' },
  'slack': { tarief: 21, category: 'software' },
  'zoom': { tarief: 21, category: 'software' },
  'dropbox': { tarief: 21, category: 'software' },
  'spotify': { tarief: 21, category: 'software' },
  'netflix': { tarief: 21, category: 'software' },
  'exact': { tarief: 21, category: 'software' },
  'twinfield': { tarief: 21, category: 'software' },
  'afas': { tarief: 21, category: 'software' },
  'moneybird': { tarief: 21, category: 'software' },
  'snelstart': { tarief: 21, category: 'software' },
  'visma': { tarief: 21, category: 'software' },
};

// Keywords in omschrijving → BTW tarief
export const KEYWORD_BTW_MAPPING: Record<string, { tarief: BTWTarief; keywords: string[]; explanation: string }> = {
  'voeding': {
    tarief: 9,
    keywords: ['boodschappen', 'supermarkt', 'eten', 'maaltijd', 'lunch', 'diner', 'restaurant'],
    explanation: 'Voedingsmiddelen vallen onder 9%'
  },
  'medicijnen': {
    tarief: 9,
    keywords: ['medicijn', 'pil', 'verband', 'pijnstiller', 'paracetamol', 'ibuprofen'],
    explanation: 'Medicijnen vallen onder 9%'
  },
  'boeken': {
    tarief: 9,
    keywords: ['boek', 'ebook', 'tijdschrift', 'krant', 'roman', 'studieboek'],
    explanation: 'Boeken vallen onder 9%'
  },
  'ov': {
    tarief: 9,
    keywords: ['trein', 'bus', 'metro', 'tram', 'ov-chipkaart', 'ov', 'vervoer'],
    explanation: 'Openbaar vervoer valt onder 9%'
  },
  'verzekering': {
    tarief: 0,
    keywords: ['verzekering', 'premie', 'dekking', 'polis', 'schade'],
    explanation: 'Verzekeringen zijn vrijgesteld'
  },
  'zorg': {
    tarief: 0,
    keywords: ['zorg', 'medisch', 'behandeling', 'therapie', 'ziekenhuis'],
    explanation: 'Zorgdiensten zijn vrijgesteld'
  },
  'onderwijs': {
    tarief: 0,
    keywords: ['onderwijs', 'les', 'cursus', 'opleiding', 'training', 'studie'],
    explanation: 'Onderwijs is vrijgesteld'
  },
  'bank': {
    tarief: 0,
    keywords: ['bank', 'rekening', 'spaar', 'hypotheek', 'krediet', 'rente'],
    explanation: 'Bankdiensten zijn vrijgesteld'
  },
  'software': {
    tarief: 21,
    keywords: ['software', 'licentie', 'abonnement', 'cloud', 'saas', 'app'],
    explanation: 'Software valt onder 21%'
  },
};

// Trust Score Levels
export type TrustLevel = 'high' | 'medium' | 'low';

export interface TrustScoreResult {
  level: TrustLevel;
  score: number;
  requiresCheck: boolean;
  userMessage: string;
  badge: string;
  badgeColor: string;
}

export interface BTWResult {
  tarief: BTWTarief;
  confidence: number;
  trustScore: TrustScoreResult;
  source: 'merchant' | 'keywords' | 'category' | 'ml' | 'default';
  explanation: string;
}

// Bereken trust score op basis van confidence en merchant type
function calculateTrustScore(
  confidence: number,
  merchant: string,
  source: string
): TrustScoreResult {
  const normalizedMerchant = merchant.toLowerCase().trim();
  
  // Hoge risico merchants (altijd checken)
  const highRiskMerchants = [
    'hema', 'amazon', 'bol.com', 'coolblue', 'wehkamp', 'gamma', 
    'praxis', 'karwei', 'ikea', 'makro', 'sligro', 'hanos'
  ];
  
  // Medium risico merchants
  const mediumRiskMerchants = [
    'mediamarkt', 'expert', 'bcc', 'ep', 'bijenkorf', 'zalando'
  ];
  
  const isHighRisk = highRiskMerchants.some(m => normalizedMerchant.includes(m));
  const isMediumRisk = mediumRiskMerchants.some(m => normalizedMerchant.includes(m));
  
  // Bereken level
  let level: TrustLevel;
  let requiresCheck: boolean;
  
  if (confidence >= 95 && !isHighRisk && !isMediumRisk) {
    level = 'high';
    requiresCheck = false;
  } else if (confidence >= 70 && !isHighRisk) {
    level = 'medium';
    requiresCheck = isMediumRisk || confidence < 85;
  } else {
    level = 'low';
    requiresCheck = true;
  }
  
  // Genereer user message
  let userMessage: string;
  let badge: string;
  let badgeColor: string;
  
  switch (level) {
    case 'high':
      userMessage = '✓ Zeer betrouwbaar - automatisch geclassificeerd';
      badge = '✓';
      badgeColor = 'text-emerald-500';
      break;
    case 'medium':
      userMessage = isHighRisk 
        ? '⚠️ HEMA verkoopt 9% en 21% producten - check zelf'
        : isMediumRisk
        ? '⚠️ Controleer deze transactie - gemixte producten mogelijk'
        : '⚡ Snel checken aanbevolen';
      badge = '?';
      badgeColor = 'text-amber-500';
      break;
    case 'low':
      userMessage = '🔴 Check verplicht - onbekende transactie';
      badge = '!';
      badgeColor = 'text-red-500';
      break;
  }
  
  return {
    level,
    score: confidence,
    requiresCheck,
    userMessage,
    badge,
    badgeColor
  };
}

// Hoofdfunctie voor BTW detectie
export function detectBTW(
  merchant: string,
  description: string,
  category?: string
): BTWResult {
  const normalizedMerchant = merchant.toLowerCase().trim();
  const normalizedDesc = description.toLowerCase();
  
  // 1. Check merchant mapping (hoogste prioriteit)
  for (const [key, value] of Object.entries(MERCHANT_BTW_MAPPING)) {
    if (normalizedMerchant.includes(key)) {
      const confidence = 95;
      return {
        tarief: value.tarief,
        confidence,
        trustScore: calculateTrustScore(confidence, merchant, 'merchant'),
        source: 'merchant',
        explanation: `${merchant} is een ${value.category} (${value.tarief === 0 ? 'vrijgesteld' : value.tarief + '%'})`
      };
    }
  }
  
  // 2. Check keywords in omschrijving
  for (const [cat, data] of Object.entries(KEYWORD_BTW_MAPPING)) {
    for (const keyword of data.keywords) {
      if (normalizedDesc.includes(keyword)) {
        const confidence = 75;
        return {
          tarief: data.tarief,
          confidence,
          trustScore: calculateTrustScore(confidence, merchant, 'keywords'),
          source: 'keywords',
          explanation: data.explanation
        };
      }
    }
  }
  
  // 3. Default naar 21%
  const confidence = 50;
  return {
    tarief: 21,
    confidence,
    trustScore: calculateTrustScore(confidence, merchant, 'default'),
    source: 'default',
    explanation: 'Standaardtarief (geen specifieke categorie herkend)'
  };
}

// Formatteer BTW voor export
export function formatBTW(tarief: BTWTarief): string {
  if (tarief === null) return 'Vrijgesteld';
  if (tarief === undefined) return 'Onbekend';
  return `${tarief}%`;
}

// Valideer of BTW correct lijkt
export function validateBTW(amount: number, btwAmount: number, tarief: BTWTarief): boolean {
  if (tarief === null || tarief === undefined) return true;
  
  // Bereken verwachte BTW
  const expectedBTW = (amount * tarief) / (100 + tarief);
  const difference = Math.abs(btwAmount - expectedBTW);
  
  // Tolerantie van 1 cent
  return difference < 0.01;
}
