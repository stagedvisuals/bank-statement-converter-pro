/**
 * Nederlandse Merchant Database voor Smart Transactie Categorisering
 * 
 * Deze database bevat veelvoorkomende Nederlandse merken en bedrijven
 * met hun bijbehorende categorieën, subcategorieën en BTW tarieven.
 */

export interface MerchantInfo {
  categorie: string
  subcategorie: string
  btw: string
  icon: string
  keywords?: string[] // Extra keywords voor matching
}

export const MERCHANT_CATEGORIES: Record<string, MerchantInfo> = {
  // Telecom
  'kpn': { categorie: 'Telecom', subcategorie: 'Internet/Telefoon', btw: '21%', icon: '', keywords: ['kpn zakelijk', 'kpn thuis'] },
  'vodafone': { categorie: 'Telecom', subcategorie: 'Internet/Telefoon', btw: '21%', icon: '', keywords: ['vodafone ziggo'] },
  't-mobile': { categorie: 'Telecom', subcategorie: 'Internet/Telefoon', btw: '21%', icon: '' },
  'tele2': { categorie: 'Telecom', subcategorie: 'Internet/Telefoon', btw: '21%', icon: '' },
  'ziggo': { categorie: 'Telecom', subcategorie: 'Internet/TV', btw: '21%', icon: '' },
  'xs4all': { categorie: 'Telecom', subcategorie: 'Internet', btw: '21%', icon: '' },
  
  // Streaming & Abonnementen
  'netflix': { categorie: 'Abonnementen', subcategorie: 'Streaming', btw: '21%', icon: '' },
  'spotify': { categorie: 'Abonnementen', subcategorie: 'Muziek', btw: '21%', icon: '' },
  'videoland': { categorie: 'Abonnementen', subcategorie: 'Streaming', btw: '21%', icon: '' },
  'disney': { categorie: 'Abonnementen', subcategorie: 'Streaming', btw: '21%', icon: '', keywords: ['disney plus'] },
  'hbo': { categorie: 'Abonnementen', subcategorie: 'Streaming', btw: '21%', icon: '', keywords: ['hbo max'] },
  'amazon prime': { categorie: 'Abonnementen', subcategorie: 'Streaming', btw: '21%', icon: '' },
  'prime video': { categorie: 'Abonnementen', subcategorie: 'Streaming', btw: '21%', icon: '' },
  'npo': { categorie: 'Abonnementen', subcategorie: 'Streaming', btw: '21%', icon: '', keywords: ['npo plus'] },
  'viaplay': { categorie: 'Abonnementen', subcategorie: 'Streaming', btw: '21%', icon: '' },
  'apple tv': { categorie: 'Abonnementen', subcategorie: 'Streaming', btw: '21%', icon: '', keywords: ['apple tv plus'] },
  
  // Supermarkten
  'albert heijn': { categorie: 'Boodschappen', subcategorie: 'Supermarkt', btw: '9%', icon: '', keywords: ['ah ', 'ah.nl'] },
  'jumbo': { categorie: 'Boodschappen', subcategorie: 'Supermarkt', btw: '9%', icon: '' },
  'lidl': { categorie: 'Boodschappen', subcategorie: 'Supermarkt', btw: '9%', icon: '' },
  'aldi': { categorie: 'Boodschappen', subcategorie: 'Supermarkt', btw: '9%', icon: '' },
  'plus': { categorie: 'Boodschappen', subcategorie: 'Supermarkt', btw: '9%', icon: '', keywords: ['plus supermarkt'] },
  'dirk': { categorie: 'Boodschappen', subcategorie: 'Supermarkt', btw: '9%', icon: '', keywords: ['dirk van den broek'] },
  'spar': { categorie: 'Boodschappen', subcategorie: 'Supermarkt', btw: '9%', icon: '' },
  'coop': { categorie: 'Boodschappen', subcategorie: 'Supermarkt', btw: '9%', icon: '' },
  'dekamarkt': { categorie: 'Boodschappen', subcategorie: 'Supermarkt', btw: '9%', icon: '' },
  'vomar': { categorie: 'Boodschappen', subcategorie: 'Supermarkt', btw: '9%', icon: '' },
  'hoogvliet': { categorie: 'Boodschappen', subcategorie: 'Supermarkt', btw: '9%', icon: '' },
  'deka': { categorie: 'Boodschappen', subcategorie: 'Supermarkt', btw: '9%', icon: '' },
  
  // Restaurants & Fast Food
  'mcdonalds': { categorie: 'Eten & Drinken', subcategorie: 'Fast Food', btw: '9%', icon: '' },
  'mc donalds': { categorie: 'Eten & Drinken', subcategorie: 'Fast Food', btw: '9%', icon: '' },
  'burger king': { categorie: 'Eten & Drinken', subcategorie: 'Fast Food', btw: '9%', icon: '' },
  'kfc': { categorie: 'Eten & Drinken', subcategorie: 'Fast Food', btw: '9%', icon: '' },
  'subway': { categorie: 'Eten & Drinken', subcategorie: 'Fast Food', btw: '9%', icon: '' },
  'dominos': { categorie: 'Eten & Drinken', subcategorie: 'Bezorging', btw: '9%', icon: '', keywords: ['domino\'s'] },
  'new york pizza': { categorie: 'Eten & Drinken', subcategorie: 'Bezorging', btw: '9%', icon: '' },
  'thuisbezorgd': { categorie: 'Eten & Drinken', subcategorie: 'Bezorging', btw: '9%', icon: '' },
  'deliveroo': { categorie: 'Eten & Drinken', subcategorie: 'Bezorging', btw: '9%', icon: '' },
  'uber eats': { categorie: 'Eten & Drinken', subcategorie: 'Bezorging', btw: '9%', icon: '' },
  'starbucks': { categorie: 'Eten & Drinken', subcategorie: 'Koffie', btw: '9%', icon: '' },
  'costa coffee': { categorie: 'Eten & Drinken', subcategorie: 'Koffie', btw: '9%', icon: '' },
  'hema': { categorie: 'Eten & Drinken', subcategorie: 'Restaurant', btw: '9%', icon: '', keywords: ['hema restaurant'] },
  
  // Tankstations
  'shell': { categorie: 'Transport', subcategorie: 'Brandstof', btw: '21%', icon: '' },
  'bp': { categorie: 'Transport', subcategorie: 'Brandstof', btw: '21%', icon: '' },
  'esso': { categorie: 'Transport', subcategorie: 'Brandstof', btw: '21%', icon: '' },
  'total': { categorie: 'Transport', subcategorie: 'Brandstof', btw: '21%', icon: '', keywords: ['total energies'] },
  'tango': { categorie: 'Transport', subcategorie: 'Brandstof', btw: '21%', icon: '' },
  'tinq': { categorie: 'Transport', subcategorie: 'Brandstof', btw: '21%', icon: '' },
  'argos': { categorie: 'Transport', subcategorie: 'Brandstof', btw: '21%', icon: '' },
  'dirk benzine': { categorie: 'Transport', subcategorie: 'Brandstof', btw: '21%', icon: '' },
  
  // OV & Mobiliteit
  'ns': { categorie: 'Transport', subcategorie: 'Openbaar Vervoer', btw: '9%', icon: '', keywords: ['nederlandse spoorwegen'] },
  'ret': { categorie: 'Transport', subcategorie: 'Openbaar Vervoer', btw: '9%', icon: '' },
  'gvb': { categorie: 'Transport', subcategorie: 'Openbaar Vervoer', btw: '9%', icon: '' },
  'htm': { categorie: 'Transport', subcategorie: 'Openbaar Vervoer', btw: '9%', icon: '' },
  'arriva': { categorie: 'Transport', subcategorie: 'Openbaar Vervoer', btw: '9%', icon: '' },
  'connexxion': { categorie: 'Transport', subcategorie: 'Openbaar Vervoer', btw: '9%', icon: '' },
  'qbuzz': { categorie: 'Transport', subcategorie: 'Openbaar Vervoer', btw: '9%', icon: '' },
  'keolis': { categorie: 'Transport', subcategorie: 'Openbaar Vervoer', btw: '9%', icon: '' },
  'ov-chipkaart': { categorie: 'Transport', subcategorie: 'Openbaar Vervoer', btw: '9%', icon: '', keywords: ['ovpay'] },
  'anwb': { categorie: 'Transport', subcategorie: 'Wegenwacht', btw: '21%', icon: '' },
  
  // Verzekeringen
  'zilveren kruis': { categorie: 'Verzekeringen', subcategorie: 'Zorgverzekering', btw: '0%', icon: '' },
  'vgz': { categorie: 'Verzekeringen', subcategorie: 'Zorgverzekering', btw: '0%', icon: '' },
  'menzis': { categorie: 'Verzekeringen', subcategorie: 'Zorgverzekering', btw: '0%', icon: '' },
  'cz': { categorie: 'Verzekeringen', subcategorie: 'Zorgverzekering', btw: '0%', icon: '' },
  'dsz': { categorie: 'Verzekeringen', subcategorie: 'Zorgverzekering', btw: '0%', icon: '', keywords: ['de friesland'] },
  'achmea': { categorie: 'Verzekeringen', subcategorie: 'Verzekering', btw: '21%', icon: '' },
  'centraal beheer': { categorie: 'Verzekeringen', subcategorie: 'Verzekering', btw: '21%', icon: '' },
  'interpolis': { categorie: 'Verzekeringen', subcategorie: 'Verzekering', btw: '21%', icon: '' },
  'aegon': { categorie: 'Verzekeringen', subcategorie: 'Verzekering', btw: '21%', icon: '' },
  'nationale nederlanden': { categorie: 'Verzekeringen', subcategorie: 'Verzekering', btw: '21%', icon: '' },
  'nn': { categorie: 'Verzekeringen', subcategorie: 'Verzekering', btw: '21%', icon: '' },
  'univé': { categorie: 'Verzekeringen', subcategorie: 'Verzekering', btw: '21%', icon: '' },
  'asr': { categorie: 'Verzekeringen', subcategorie: 'Verzekering', btw: '21%', icon: '' },
  
  // Energie
  'eneco': { categorie: 'Huisvesting', subcategorie: 'Energie', btw: '21%', icon: '' },
  'nuon': { categorie: 'Huisvesting', subcategorie: 'Energie', btw: '21%', icon: '', keywords: ['vandebron'] },
  'essent': { categorie: 'Huisvesting', subcategorie: 'Energie', btw: '21%', icon: '' },
  'greenchoice': { categorie: 'Huisvesting', subcategorie: 'Energie', btw: '21%', icon: '' },
  'om': { categorie: 'Huisvesting', subcategorie: 'Energie', btw: '21%', icon: '', keywords: ['om nieuwe energie'] },
  'engie': { categorie: 'Huisvesting', subcategorie: 'Energie', btw: '21%', icon: '' },
  'delta': { categorie: 'Huisvesting', subcategorie: 'Energie', btw: '21%', icon: '' },
  'e.on': { categorie: 'Huisvesting', subcategorie: 'Energie', btw: '21%', icon: '' },
  'eon': { categorie: 'Huisvesting', subcategorie: 'Energie', btw: '21%', icon: '' },
  'budget energie': { categorie: 'Huisvesting', subcategorie: 'Energie', btw: '21%', icon: '' },
  'vandebron': { categorie: 'Huisvesting', subcategorie: 'Energie', btw: '21%', icon: '' },
  'netbeheer nederland': { categorie: 'Huisvesting', subcategorie: 'Netbeheer', btw: '21%', icon: '' },
  'liander': { categorie: 'Huisvesting', subcategorie: 'Netbeheer', btw: '21%', icon: '' },
  'stedin': { categorie: 'Huisvesting', subcategorie: 'Netbeheer', btw: '21%', icon: '' },
  'enexis': { categorie: 'Huisvesting', subcategorie: 'Netbeheer', btw: '21%', icon: '' },
  
  // Water & Internet Providers
  'vitens': { categorie: 'Huisvesting', subcategorie: 'Water', btw: '9%', icon: '' },
  'evides': { categorie: 'Huisvesting', subcategorie: 'Water', btw: '9%', icon: '' },
  'pwn': { categorie: 'Huisvesting', subcategorie: 'Water', btw: '9%', icon: '' },
  'oasen': { categorie: 'Huisvesting', subcategorie: 'Water', btw: '9%', icon: '' },
  
  // Online Retail
  'bol.com': { categorie: 'Online Winkelen', subcategorie: 'Webshop', btw: '21%', icon: '' },
  'amazon': { categorie: 'Online Winkelen', subcategorie: 'Webshop', btw: '21%', icon: '', keywords: ['amazon.nl'] },
  'coolblue': { categorie: 'Online Winkelen', subcategorie: 'Webshop', btw: '21%', icon: '' },
  'mediamarkt': { categorie: 'Online Winkelen', subcategorie: 'Webshop', btw: '21%', icon: '' },
  'wehkamp': { categorie: 'Online Winkelen', subcategorie: 'Webshop', btw: '21%', icon: '' },
  'zalando': { categorie: 'Online Winkelen', subcategorie: 'Mode', btw: '21%', icon: '' },
  'asos': { categorie: 'Online Winkelen', subcategorie: 'Mode', btw: '21%', icon: '' },
  'action': { categorie: 'Online Winkelen', subcategorie: 'Webshop', btw: '21%', icon: '' },
  'ikea': { categorie: 'Online Winkelen', subcategorie: 'Wonen', btw: '21%', icon: '' },
  'praxis': { categorie: 'Online Winkelen', subcategorie: 'Klussen', btw: '21%', icon: '' },
  'gamma': { categorie: 'Online Winkelen', subcategorie: 'Klussen', btw: '21%', icon: '' },
  'karwei': { categorie: 'Online Winkelen', subcategorie: 'Klussen', btw: '21%', icon: '' },
  'bouwmarkt': { categorie: 'Online Winkelen', subcategorie: 'Klussen', btw: '21%', icon: '' },
  
  // Software & Tools
  'google': { categorie: 'Software', subcategorie: 'Cloud', btw: '21%', icon: '', keywords: ['google workspace', 'gsuite'] },
  'microsoft': { categorie: 'Software', subcategorie: 'Cloud', btw: '21%', icon: '', keywords: ['office 365', 'microsoft 365'] },
  'adobe': { categorie: 'Software', subcategorie: 'Creatief', btw: '21%', icon: '', keywords: ['creative cloud'] },
  'dropbox': { categorie: 'Software', subcategorie: 'Cloud', btw: '21%', icon: '' },
  'slack': { categorie: 'Software', subcategorie: 'Communicatie', btw: '21%', icon: '' },
  'zoom': { categorie: 'Software', subcategorie: 'Communicatie', btw: '21%', icon: '' },
  'notion': { categorie: 'Software', subcategorie: 'Productiviteit', btw: '21%', icon: '' },
  'asana': { categorie: 'Software', subcategorie: 'Productiviteit', btw: '21%', icon: '' },
  'trello': { categorie: 'Software', subcategorie: 'Productiviteit', btw: '21%', icon: '' },
  'canva': { categorie: 'Software', subcategorie: 'Creatief', btw: '21%', icon: '' },
  'github': { categorie: 'Software', subcategorie: 'Development', btw: '21%', icon: '' },
  'gitlab': { categorie: 'Software', subcategorie: 'Development', btw: '21%', icon: '' },
  'jetbrains': { categorie: 'Software', subcategorie: 'Development', btw: '21%', icon: '' },
  'atlassian': { categorie: 'Software', subcategorie: 'Productiviteit', btw: '21%', icon: '', keywords: ['jira', 'confluence'] },
  
  // Banking
  'ing': { categorie: 'Bankkosten', subcategorie: 'Bank', btw: '0%', icon: '' },
  'rabobank': { categorie: 'Bankkosten', subcategorie: 'Bank', btw: '0%', icon: '' },
  'abn amro': { categorie: 'Bankkosten', subcategorie: 'Bank', btw: '0%', icon: '' },
  'bunq': { categorie: 'Bankkosten', subcategorie: 'Bank', btw: '0%', icon: '' },
  'asn bank': { categorie: 'Bankkosten', subcategorie: 'Bank', btw: '0%', icon: '' },
  'sns bank': { categorie: 'Bankkosten', subcategorie: 'Bank', btw: '0%', icon: '' },
  'triodos': { categorie: 'Bankkosten', subcategorie: 'Bank', btw: '0%', icon: '' },
  'knab': { categorie: 'Bankkosten', subcategorie: 'Bank', btw: '0%', icon: '' },
  'revolut': { categorie: 'Bankkosten', subcategorie: 'Bank', btw: '0%', icon: '' },
  'wise': { categorie: 'Bankkosten', subcategorie: 'Bank', btw: '0%', icon: '', keywords: ['transferwise'] },
  'paypal': { categorie: 'Bankkosten', subcategorie: 'Betaalprovider', btw: '0%', icon: '' },
  'stripe': { categorie: 'Bankkosten', subcategorie: 'Betaalprovider', btw: '0%', icon: '' },
  'adyen': { categorie: 'Bankkosten', subcategorie: 'Betaalprovider', btw: '0%', icon: '' },
  'mollie': { categorie: 'Bankkosten', subcategorie: 'Betaalprovider', btw: '0%', icon: '' },
  
  // Boekhouding
  'exact': { categorie: 'Boekhouding', subcategorie: 'Accountancy', btw: '21%', icon: '' },
  'twinfield': { categorie: 'Boekhouding', subcategorie: 'Accountancy', btw: '21%', icon: '' },
  'snelstart': { categorie: 'Boekhouding', subcategorie: 'Accountancy', btw: '21%', icon: '' },
  'revisonline': { categorie: 'Boekhouding', subcategorie: 'Accountancy', btw: '21%', icon: '' },
  'e-boekhouden': { categorie: 'Boekhouding', subcategorie: 'Accountancy', btw: '21%', icon: '' },
  'moneybird': { categorie: 'Boekhouding', subcategorie: 'Accountancy', btw: '21%', icon: '' },
  'administratie': { categorie: 'Boekhouding', subcategorie: 'Accountancy', btw: '21%', icon: '' },
  'accountant': { categorie: 'Boekhouding', subcategorie: 'Accountancy', btw: '21%', icon: '' },
  'belastingdienst': { categorie: 'Belastingen', subcategorie: 'Overheid', btw: '0%', icon: '' },
  
  // Overheid
  'gemeente': { categorie: 'Overheid', subcategorie: 'Gemeentebelasting', btw: '0%', icon: '' },
  'waterschap': { categorie: 'Overheid', subcategorie: 'Waterschap', btw: '0%', icon: '' },
  'provincie': { categorie: 'Overheid', subcategorie: 'Provincie', btw: '0%', icon: '' },
  'cbr': { categorie: 'Overheid', subcategorie: 'Overig', btw: '21%', icon: '' },
  'rdw': { categorie: 'Overheid', subcategorie: 'Overig', btw: '0%', icon: '' },
  'duo': { categorie: 'Overheid', subcategorie: 'Onderwijs', btw: '0%', icon: '' },
  
  // Onderwijs
  'udemy': { categorie: 'Opleiding', subcategorie: 'E-learning', btw: '21%', icon: '' },
  'coursera': { categorie: 'Opleiding', subcategorie: 'E-learning', btw: '21%', icon: '' },
  'linkedin learning': { categorie: 'Opleiding', subcategorie: 'E-learning', btw: '21%', icon: '' },
  'skillshare': { categorie: 'Opleiding', subcategorie: 'E-learning', btw: '21%', icon: '' },
  'pluralsight': { categorie: 'Opleiding', subcategorie: 'E-learning', btw: '21%', icon: '' },
  
  // Parkeren
  'parking': { categorie: 'Transport', subcategorie: 'Parkeren', btw: '21%', icon: '' },
  'q-park': { categorie: 'Transport', subcategorie: 'Parkeren', btw: '21%', icon: '' },
  'yellowbrick': { categorie: 'Transport', subcategorie: 'Parkeren', btw: '21%', icon: '' },
  
  // Taxi & Deelmobiliteit
  'uber': { categorie: 'Transport', subcategorie: 'Taxi', btw: '21%', icon: '' },
  'bolt': { categorie: 'Transport', subcategorie: 'Taxi', btw: '21%', icon: '' },
  
  // Kleding
  'h&m': { categorie: 'Online Winkelen', subcategorie: 'Mode', btw: '21%', icon: '' },
  'zara': { categorie: 'Online Winkelen', subcategorie: 'Mode', btw: '21%', icon: '' },
  'primark': { categorie: 'Online Winkelen', subcategorie: 'Mode', btw: '21%', icon: '' },
  
  // Bouwmarkten
  'hornbach': { categorie: 'Online Winkelen', subcategorie: 'Klussen', btw: '21%', icon: '' },
  
  // Gezondheid - Apotheek
  'apotheek': { categorie: 'Gezondheid', subcategorie: 'Apotheek', btw: '9%', icon: '' },
  
  // Gezondheid - Drogist
  'etos': { categorie: 'Gezondheid', subcategorie: 'Drogist', btw: '21%', icon: '' },
  'kruidvat': { categorie: 'Gezondheid', subcategorie: 'Drogist', btw: '21%', icon: '' },
  'da': { categorie: 'Gezondheid', subcategorie: 'Drogist', btw: '21%', icon: '' },
  
  // Gezondheid - Zorg
  'huisarts': { categorie: 'Gezondheid', subcategorie: 'Arts', btw: '0%', icon: '' },
  'tandarts': { categorie: 'Gezondheid', subcategorie: 'Tandarts', btw: '21%', icon: '' },
  'fysiotherapie': { categorie: 'Gezondheid', subcategorie: 'Fysiotherapie', btw: '21%', icon: '' },
  'fysio': { categorie: 'Gezondheid', subcategorie: 'Fysiotherapie', btw: '21%', icon: '' },
  
  // Overheid & Belasting
  'uwv': { categorie: 'Overheid', subcategorie: 'UWV', btw: '0%', icon: '' },
  'cak': { categorie: 'Overheid', subcategorie: 'CAK', btw: '0%', icon: '' },
  'cjib': { categorie: 'Overheid', subcategorie: 'Boete', btw: '0%', icon: '' },
  
  // Energie
  'vattenfall': { categorie: 'Huisvesting', subcategorie: 'Energie', btw: '21%', icon: '' },
  
  // Verzekeringen
  
  // Financieel
  'rente': { categorie: 'Bankkosten', subcategorie: 'Rente', btw: '0%', icon: '' },
  'aflossing': { categorie: 'Bankkosten', subcategorie: 'Lening', btw: '0%', icon: '' },
  'hypotheek': { categorie: 'Bankkosten', subcategorie: 'Hypotheek', btw: '0%', icon: '' },
  'tikkie': { categorie: 'Bankkosten', subcategorie: 'Betaaldienst', btw: '0%', icon: '' },
  
  // Software - AI
  'openai': { categorie: 'Software', subcategorie: 'AI', btw: '21%', icon: '' },
  'anthropic': { categorie: 'Software', subcategorie: 'AI', btw: '21%', icon: '' },
  
  // Wonen
  'huur': { categorie: 'Huisvesting', subcategorie: 'Huur', btw: '21%', icon: '' },
  'vve': { categorie: 'Huisvesting', subcategorie: 'VvE', btw: '21%', icon: '' },
  'woningcorporatie': { categorie: 'Huisvesting', subcategorie: 'Huur', btw: '21%', icon: '' },
  
  // Inkomen
  'salaris': { categorie: 'Inkomen', subcategorie: 'Salaris', btw: '0%', icon: '' },
  'loon': { categorie: 'Inkomen', subcategorie: 'Salaris', btw: '0%', icon: '' },
  'uitkering': { categorie: 'Inkomen', subcategorie: 'Uitkering', btw: '0%', icon: '' },
  'pensioen': { categorie: 'Inkomen', subcategorie: 'Pensioen', btw: '0%', icon: '' },
  'dividend': { categorie: 'Inkomen', subcategorie: 'Dividend', btw: '0%', icon: '' },
  
  // Sport & Fitness
  'basic fit': { categorie: 'Sport', subcategorie: 'Sportschool', btw: '21%', icon: '' },
  'fitness': { categorie: 'Sport', subcategorie: 'Sportschool', btw: '21%', icon: '' },
  'sportschool': { categorie: 'Sport', subcategorie: 'Sportschool', btw: '21%', icon: '' },
  
  // Onderwijs
  'school': { categorie: 'Onderwijs', subcategorie: 'School', btw: '0%', icon: '' },
  'universiteit': { categorie: 'Onderwijs', subcategorie: 'Universiteit', btw: '0%', icon: '' },
  'cursus': { categorie: 'Opleiding', subcategorie: 'Cursus', btw: '21%', icon: '' },
}

/**
 * Categoriseer een transactie op basis van de omschrijving
 * Gebruikt fuzzy matching om merchants te herkennen
 */
export function categorizeTransaction(omschrijving: string): MerchantInfo {
  if (!omschrijving) {
    return { categorie: 'Overig', subcategorie: 'Overig', btw: '21%', icon: '' }
  }
  
  const lowerDesc = omschrijving.toLowerCase()
  
  // 1. Exacte match
  for (const [merchant, info] of Object.entries(MERCHANT_CATEGORIES)) {
    if (lowerDesc.includes(merchant.toLowerCase())) {
      return info
    }
  }
  
  // 2. Keyword matching
  for (const [merchant, info] of Object.entries(MERCHANT_CATEGORIES)) {
    const keywords = info.keywords || []
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        return info
      }
    }
  }
  
  // 3. Gedeeltelijke match (voor bedrijfsnamen met extra tekst)
  for (const [merchant, info] of Object.entries(MERCHANT_CATEGORIES)) {
    const merchantWords = merchant.toLowerCase().split(' ')
    const matches = merchantWords.filter(word => lowerDesc.includes(word))
    if (matches.length >= merchantWords.length * 0.7) { // 70% match
      return info
    }
  }
  
  // 4. Fallback patronen
  if (lowerDesc.includes('pin ') || lowerDesc.includes('betaalautomaat')) {
    return { categorie: 'Winkelen', subcategorie: 'PIN Betaling', btw: '21%', icon: '' }
  }
  
  if (lowerDesc.includes('incasso') || lowerDesc.includes('machtiging')) {
    return { categorie: 'Abonnementen', subcategorie: 'Automatische Incasso', btw: '21%', icon: '' }
  }
  
  if (lowerDesc.includes('overschrijving') || lowerDesc.includes('overboeking')) {
    return { categorie: 'Overboekingen', subcategorie: 'Overboeking', btw: '0%', icon: '' }
  }
  
  if (lowerDesc.includes('geldopname') || lowerDesc.includes('atm') || lowerDesc.includes('geldautomaat')) {
    return { categorie: 'Contant', subcategorie: 'Geldopname', btw: '0%', icon: '' }
  }
  
  return { categorie: 'Overig', subcategorie: 'Overig', btw: '21%', icon: '' }
}

/**
 * Haal categorie suggesties op voor een lijst transacties
 */
export function getCategorySuggestions(transactions: Array<{ omschrijving: string }>): Array<{
  omschrijving: string
  suggestie: MerchantInfo | null
}> {
  return transactions.map(t => ({
    omschrijving: t.omschrijving,
    suggestie: categorizeTransaction(t.omschrijving)
  }))
}

/**
 * Bereken categorie statistieken
 */
export function calculateCategoryStats(transactions: Array<{ 
  omschrijving: string
  bedrag: number
}>): Record<string, {
  count: number
  total: number
  percentage: number
}> {
  const stats: Record<string, { count: number; total: number }> = {}
  let grandTotal = 0
  
  for (const t of transactions) {
    const cat = categorizeTransaction(t.omschrijving)
    const categoryName = cat?.categorie || 'Overig'
    
    if (!stats[categoryName]) {
      stats[categoryName] = { count: 0, total: 0 }
    }
    
    stats[categoryName].count++
    stats[categoryName].total += Math.abs(t.bedrag)
    grandTotal += Math.abs(t.bedrag)
  }
  
  // Bereken percentages
  const result: Record<string, { count: number; total: number; percentage: number }> = {}
  for (const [cat, data] of Object.entries(stats)) {
    result[cat] = {
      ...data,
      percentage: grandTotal > 0 ? Math.round((data.total / grandTotal) * 100) : 0
    }
  }
  
  return result
}
