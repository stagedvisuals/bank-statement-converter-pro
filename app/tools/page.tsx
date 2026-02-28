'use client';

import { useState, useEffect } from 'react';
import { Calculator, DollarSign, Clock, FileCheck, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Gratis Tools voor ZZP'ers</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Praktische rekentools voor Nederlandse ondernemers en boekhouders. 
            Bereken je BTW, netto inkomen, uurtarief of check je factuur direct.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* TOOL 1: BTW Pot Calculator */}
          <BTWPotCalculator />
          
          {/* TOOL 2: ZZP Netto Calculator */}
          <ZZPNettoCalculator />
          
          {/* TOOL 3: Uurtarief Calculator */}
          <UurtariefCalculator />
          
          {/* TOOL 4: Factuur Checker */}
          <FactuurChecker />
          
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// TOOL 1: BTW POT CALCULATOR
// ═══════════════════════════════════════
function BTWPotCalculator() {
  const [omzet, setOmzet] = useState('');
  const [btwTarief, setBtwTarief] = useState('21');
  const [heeftKOR, setHeeftKOR] = useState(false);

  const omzetNum = parseFloat(omzet) || 0;
  const btwBedrag = omzetNum * (parseInt(btwTarief) / 100);
  const nettoInkomen = omzetNum;
  
  // KOR berekening (vereenvoudigd)
  let korKorting = 0;
  if (heeftKOR && btwBedrag > 0) {
    if (btwBedrag <= 1343) korKorting = btwBedrag;
    else if (btwBedrag <= 1883) korKorting = 1343 - (btwBedrag - 1343) * 2.5;
    else korKorting = 0;
  }
  
  const btwTeBetalen = Math.max(0, btwBedrag - korKorting);
  const maandelijksOpzij = btwTeBetalen > 0 ? btwTeBetalen / 12 : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#00b8d9]/10 rounded-lg flex items-center justify-center">
          <Calculator className="w-5 h-5 text-[#00b8d9]" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">BTW Pot Calculator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Omzet excl. BTW (€)</label>
          <input
            type="number"
            value={omzet}
            onChange={(e) => setOmzet(e.target.value)}
            placeholder="1000"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-[#00b8d9]"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">BTW tarief</label>
          <select
            value={btwTarief}
            onChange={(e) => setBtwTarief(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-[#00b8d9]"
          >
            <option value="21">21% (hoog)</option>
            <option value="9">9% (laag)</option>
            <option value="0">0% (vrijgesteld)</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-2">
          <label className="text-sm text-muted-foreground">Ik gebruik KOR (kleine ondernemersregeling)</label>
          <button
            onClick={() => setHeeftKOR(!heeftKOR)}
            className={`w-12 h-6 rounded-full transition-colors ${heeftKOR ? 'bg-[#00b8d9]' : 'bg-muted'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${heeftKOR ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {omzetNum > 0 && (
        <div className="mt-6 space-y-3">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-sm text-amber-600">BTW bedrag om op te zetten:</p>
            <p className="text-2xl font-bold text-amber-500">€{btwTeBetalen.toFixed(2)}</p>
            {korKorting > 0 && (
              <p className="text-xs text-muted-foreground mt-1">Inclusief KOR korting: €{korKorting.toFixed(2)}</p>
            )}
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <p className="text-sm text-emerald-600">Je netto inkomen:</p>
            <p className="text-2xl font-bold text-emerald-500">€{nettoInkomen.toFixed(2)}</p>
          </div>

          {maandelijksOpzij > 0 && (
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
              <p className="text-sm text-cyan-600">💡 Aanbeveling:</p>
              <p className="text-foreground">Zet elke maand <strong>€{maandelijksOpzij.toFixed(0)}</strong> apart op een spaarrekening</p>
            </div>
          )}
        </div>
      )}

      <CTABanner />
    </div>
  );
}

// ═══════════════════════════════════════
// TOOL 2: ZZP NETTO INKOMEN CALCULATOR
// ═══════════════════════════════════════
function ZZPNettoCalculator() {
  const [jaaromzet, setJaaromzet] = useState('');
  const [kosten, setKosten] = useState('');
  const [isStarter, setIsStarter] = useState(false);

  const omzet = parseFloat(jaaromzet) || 0;
  const kostenNum = parseFloat(kosten) || 0;
  
  // 2025 bedragen
  const ZELFSTANDIGENAFTREK = 2470;
  const MKB_PERCENTAGE = 0.127;
  const HEFFINGSKORTING = 3068;
  const MAX_ARBEIDSKORTING = 5052;
  
  const brutoWinst = omzet - kostenNum;
  const zelfstandigenaftrek = isStarter ? ZELFSTANDIGENAFTREK * 2 : ZELFSTANDIGENAFTREK;
  const mkbVrijgesteld = Math.max(0, brutoWinst - zelfstandigenaftrek) * MKB_PERCENTAGE;
  const belastbaarInkomen = Math.max(0, brutoWinst - zelfstandigenaftrek - mkbVrijgesteld);
  
  // Belastingschijven 2025
  let belasting = 0;
  if (belastbaarInkomen <= 38441) {
    belasting = belastbaarInkomen * 0.3582;
  } else {
    belasting = 38441 * 0.3582 + (belastbaarInkomen - 38441) * 0.4950;
  }
  
  // Kortingen
  const arbeidskorting = Math.min(MAX_ARBEIDSKORTING, belastbaarInkomen * 0.085);
  const totaleKorting = HEFFINGSKORTING + arbeidskorting;
  const teBetalen = Math.max(0, belasting - totaleKorting);
  
  const nettoJaar = brutoWinst - teBetalen;
  const nettoMaand = nettoJaar / 12;
  const effectiefPercentage = brutoWinst > 0 ? (teBetalen / brutoWinst) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-emerald-500" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">ZZP Netto Inkomen 2025</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Jaaromzet (€)</label>
          <input
            type="number"
            value={jaaromzet}
            onChange={(e) => setJaaromzet(e.target.value)}
            placeholder="80000"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-[#00b8d9]"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Verwachte kosten (€)</label>
          <input
            type="number"
            value={kosten}
            onChange={(e) => setKosten(e.target.value)}
            placeholder="15000"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-[#00b8d9]"
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <label className="text-sm text-muted-foreground">Ik ben starter ( startersaftrek )</label>
          <button
            onClick={() => setIsStarter(!isStarter)}
            className={`w-12 h-6 rounded-full transition-colors ${isStarter ? 'bg-[#00b8d9]' : 'bg-muted'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isStarter ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {omzet > 0 && (
        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Bruto winst</span>
            <span className="font-medium">€{brutoWinst.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Zelfstandigenaftrek</span>
            <span className="text-emerald-500">- €{zelfstandigenaftrek.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">MKB-winstvrijstelling (12,7%)</span>
            <span className="text-emerald-500">- €{mkbVrijgesteld.toFixed(0)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Belastbaar inkomen</span>
            <span className="font-medium">€{belastbaarInkomen.toFixed(0)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Te betalen belasting</span>
            <span className="text-amber-500">€{teBetalen.toFixed(0)}</span>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-4">
            <p className="text-sm text-emerald-600">NETTO per jaar</p>
            <p className="text-3xl font-bold text-emerald-500">€{nettoJaar.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">≈ €{nettoMaand.toFixed(0)} per maand</p>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Effectief belastingpercentage: {effectiefPercentage.toFixed(1)}%
          </p>
        </div>
      )}

      <CTABanner />
    </div>
  );
}

// ═══════════════════════════════════════
// TOOL 3: UURTARIEF CALCULATOR
// ═══════════════════════════════════════
function UurtariefCalculator() {
  const [gewenstNetto, setGewenstNetto] = useState('4000');
  const [vakantiedagen, setVakantiedagen] = useState(25);
  const [ziekteDagen, setZiekteDagen] = useState(5);
  const [nietDeclarabeleUren, setNietDeclarabeleUren] = useState(10);
  const [kostenPerMaand, setKostenPerMaand] = useState('1000');

  const netto = parseFloat(gewenstNetto) || 0;
  const kosten = parseFloat(kostenPerMaand) || 0;
  
  // Berekeningen
  const werkbareWeken = 52 - (vakantiedagen / 5) - (ziekteDagen / 5);
  const declarabeleUrenPerWeek = 40 - nietDeclarabeleUren;
  const declarabeleUrenPerJaar = werkbareWeken * declarabeleUrenPerWeek;
  
  // Omrekenen netto naar bruto (vereenvoudigd)
  const brutoNodig = netto * 1.5; // Circa 50% belasting/lasten
  const totaleOmzetNodig = (brutoNodig + kosten) * 12;
  
  const minimaalUurtarief = totaleOmzetNodig / declarabeleUrenPerJaar;
  const aanbevolenUurtarief = minimaalUurtarief * 1.2;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5 text-purple-500" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Uurtarief Calculator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Gewenst netto maandinkomen (€)</label>
          <input
            type="number"
            value={gewenstNetto}
            onChange={(e) => setGewenstNetto(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-[#00b8d9]"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Vakantiedagen per jaar: {vakantiedagen}</label>
          <input
            type="range"
            min="15"
            max="30"
            value={vakantiedagen}
            onChange={(e) => setVakantiedagen(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Ziektedagen schatting: {ziekteDagen}</label>
          <input
            type="range"
            min="0"
            max="20"
            value={ziekteDagen}
            onChange={(e) => setZiekteDagen(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Niet-declarabele uren/week: {nietDeclarabeleUren}</label>
          <input
            type="range"
            min="0"
            max="20"
            value={nietDeclarabeleUren}
            onChange={(e) => setNietDeclarabeleUren(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Vaste kosten per maand (€)</label>
          <input
            type="number"
            value={kostenPerMaand}
            onChange={(e) => setKostenPerMaand(e.target.value)}
            placeholder="1000"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-[#00b8d9]"
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-sm text-amber-600">Minimaal uurtarief:</p>
          <p className="text-2xl font-bold text-amber-500">€{minimaalUurtarief.toFixed(2)}</p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <p className="text-sm text-emerald-600">Aanbevolen uurtarief (+20% buffer):</p>
          <p className="text-3xl font-bold text-emerald-500">€{aanbevolenUurtarief.toFixed(2)}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
          <p>Factureerbare uren per jaar: <strong>{declarabeleUrenPerJaar.toFixed(0)}</strong></p>
          <p className="mt-2">💡 Marktconform? IT freelancers rekenen €75-150/uur, consultants €100-250/uur</p>
        </div>
      </div>

      <CTABanner />
    </div>
  );
}

// ═══════════════════════════════════════
// TOOL 4: FACTUUR CHECKER
// ═══════════════════════════════════════
function FactuurChecker() {
  const [checks, setChecks] = useState<Record<string, boolean>>({
    leverancierNaam: false,
    kvk: false,
    btwNummer: false,
    afnemerNaam: false,
    factuurnummer: false,
    factuurdatum: false,
    omschrijving: false,
    hoeveelheid: false,
    bedragExcl: false,
    btwTarief: false,
    btwBedrag: false,
    totaal: false,
  });

  const toggleCheck = (key: string) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const totalCount = Object.keys(checks).length;
  const isComplete = checkedCount === totalCount;

  const checklistItems = [
    { key: 'leverancierNaam', label: 'Naam en adres leverancier' },
    { key: 'kvk', label: 'KvK-nummer leverancier' },
    { key: 'btwNummer', label: 'BTW-nummer leverancier' },
    { key: 'afnemerNaam', label: 'Naam en adres afnemer' },
    { key: 'factuurnummer', label: 'Factuurnummer (uniek en oplopend)' },
    { key: 'factuurdatum', label: 'Factuurdatum' },
    { key: 'omschrijving', label: 'Omschrijving geleverde dienst/product' },
    { key: 'hoeveelheid', label: 'Hoeveelheid of omvang' },
    { key: 'bedragExcl', label: 'Bedrag excl. BTW per post' },
    { key: 'btwTarief', label: 'BTW-tarief (21%, 9% of 0%)' },
    { key: 'btwBedrag', label: 'BTW-bedrag' },
    { key: 'totaal', label: 'Totaalbedrag incl. BTW' },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
          <FileCheck className="w-5 h-5 text-cyan-500" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Factuur Checker</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Controleer of je factuur voldoet aan de eisen van de Belastingdienst
      </p>

      <div className="space-y-2">
        {checklistItems.map((item) => (
          <button
            key={item.key}
            onClick={() => toggleCheck(item.key)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
              checks[item.key] 
                ? 'bg-emerald-500/10 border border-emerald-500/30' 
                : 'bg-muted/50 border border-transparent hover:bg-muted'
            }`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              checks[item.key] ? 'bg-emerald-500 border-emerald-500' : 'border-muted-foreground'
            }`}>
              {checks[item.key] && <span className="text-white text-xs">✓</span>}
            </div>
            <span className={`text-sm ${checks[item.key] ? 'text-emerald-600 line-through' : 'text-foreground'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        {isComplete ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
            <p className="text-lg font-semibold text-emerald-600">✅ Factuur voldoet aan alle eisen!</p>
          </div>
        ) : (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-amber-600">
              ⚠️ Let op: <strong>{totalCount - checkedCount}</strong> velden ontbreken
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Vink alle velden aan om te zien of je factuur compleet is
            </p>
          </div>
        )}

        <button
          onClick={() => window.print()}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download className="w-4 h-4" />
          Download checklist als PDF
        </button>
      </div>

      <CTABanner />
    </div>
  );
}

// CTA Banner component
function CTABanner() {
  return (
    <div className="mt-6 pt-6 border-t border-border">
      <Link href="/">
        <div className="bg-gradient-to-r from-[#00b8d9]/10 to-cyan-500/10 border border-[#00b8d9]/20 rounded-lg p-4 hover:border-[#00b8d9]/40 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Bankafschriften automatisch verwerken?</p>
              <p className="text-xs text-muted-foreground">Probeer BSCPro gratis →</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#00b8d9]" />
          </div>
        </div>
      </Link>
    </div>
  );
}