'use client'

import { useState } from 'react'

const DEMO_DATA = {
  bank: "ING",
  rekeninghouder: "J. de Vries (Demo)",
  rekeningnummer: "NL91INGB0001234567",
  periode: { van: "2026-01-01", tot: "2026-01-31" },
  transacties: [
    { datum: "2026-01-31", omschrijving: "Salaris Bedrijf B.V.", bedrag: 3200.00, categorie: "inkomen" },
    { datum: "2026-01-28", omschrijving: "Albert Heijn", bedrag: -67.43, categorie: "boodschappen" },
    { datum: "2026-01-27", omschrijving: "Shell Tankstation", bedrag: -89.00, categorie: "vervoer" },
    { datum: "2026-01-25", omschrijving: "KPN Telefoon", bedrag: -45.00, categorie: "kantoor" },
    { datum: "2026-01-20", omschrijving: "Huur Jan 2026", bedrag: -1200.00, categorie: "wonen" },
    { datum: "2026-01-15", omschrijving: "Factuur Klant ABC", bedrag: 850.00, categorie: "inkomen" },
    { datum: "2026-01-10", omschrijving: "NS Treinabonnement", bedrag: -89.00, categorie: "vervoer" },
    { datum: "2026-01-05", omschrijving: "Boekhoudkantoor", bedrag: -150.00, categorie: "kantoor" },
  ]
}

export default function DemoMode() {
  const [showDemo, setShowDemo] = useState(false)
  
  const inkomsten = DEMO_DATA.transacties
    .filter(t => t.bedrag > 0)
    .reduce((s, t) => s + t.bedrag, 0)
  
  const uitgaven = Math.abs(DEMO_DATA.transacties
    .filter(t => t.bedrag < 0)
    .reduce((s, t) => s + t.bedrag, 0))

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <button
        onClick={() => setShowDemo(!showDemo)}
        className="w-full py-3 border-2 border-dashed border-[#00b8d9]/40 rounded-xl text-[#00b8d9] text-sm font-medium hover:border-[#00b8d9] hover:bg-[#00b8d9]/5 transition-all"
      >
        {showDemo ? '↑ Demo verbergen' : '↓ Demo bekijken (zonder upload)'}
      </button>

      {showDemo && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 bg-[#00b8d9]/10 border border-[#00b8d9]/30 rounded-xl">
            <p className="text-sm text-[#00b8d9] font-medium">
              🎭 Dit is een demo met fictieve data. Start een gratis account om je eigen bankafschriften te converteren.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-xl md:text-2xl font-bold text-[#00b8d9]">
                {DEMO_DATA.transacties.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Transacties</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-xl md:text-2xl font-bold text-emerald-500">
                €{inkomsten.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Inkomsten</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-xl md:text-2xl font-bold text-destructive">
                €{uitgaven.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Uitgaven</p>
            </div>
          </div>

          {/* Bank Info */}
          <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl text-sm flex-wrap">
            <span>🏦 <strong>{DEMO_DATA.bank}</strong></span>
            <span>👤 {DEMO_DATA.rekeninghouder}</span>
          </div>

          {/* Transaction Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-medium">📋 Transacties</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left p-3">Datum</th>
                    <th className="text-left p-3">Omschrijving</th>
                    <th className="text-right p-3">Bedrag</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_DATA.transacties.map((t, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/20">
                      <td className="p-3 text-muted-foreground whitespace-nowrap">{t.datum}</td>
                      <td className="p-3 truncate max-w-[120px] md:max-w-[200px]">{t.omschrijving}</td>
                      <td className={`p-3 text-right font-medium whitespace-nowrap ${t.bedrag >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                        {t.bedrag >= 0 ? '+' : ''}€{t.bedrag.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/register" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(0,184,217,0.4)]"
            >
              🚀 Start gratis trial
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
