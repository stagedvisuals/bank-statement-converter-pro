'use client'

import { useState } from 'react'
import { Calculator } from 'lucide-react'

export default function ROICalculator() {
  const [documents, setDocuments] = useState(20)
  const hourlyRate = 50 // Average hourly rate for admin work
  const timePerDoc = 5 // minutes per document manually
  const costPerDoc = 2 // €2 per document with BSC Pro
  
  const monthlyHoursSaved = (documents * timePerDoc) / 60
  const monthlyMoneySaved = (monthlyHoursSaved * hourlyRate) - (documents * costPerDoc)
  const yearlySavings = monthlyMoneySaved * 12
  
  return (
    <div className="bg-white rounded-2xl p-8 card-shadow border border-fintech-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-success" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-navy">ROI Calculator</h3>
          <p className="text-slate text-sm">Bereken je maandelijkse besparing</p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="font-medium text-navy">Documenten per maand</label>
          <span className="text-2xl font-bold text-success">{documents}</span>
        </div>
        <input
          type="range"
          min="5"
          max="200"
          value={documents}
          onChange={(e) => setDocuments(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-slate mt-2">
          <span>5 docs</span>
          <span>200+ docs</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-fintech-bg p-4 rounded-xl">
          <p className="text-slate text-sm mb-1">Tijdsbesparing</p>
          <p className="text-2xl font-bold text-navy">{monthlyHoursSaved.toFixed(1)}u</p>
          <p className="text-xs text-slate">per maand</p>
        </div>
        <div className="bg-success/10 p-4 rounded-xl">
          <p className="text-success-dark text-sm mb-1">Geldbesparing</p>
          <p className="text-2xl font-bold text-success-dark">€{monthlyMoneySaved.toFixed(0)}</p>
          <p className="text-xs text-success-dark">per maand</p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-navy rounded-xl text-white">
        <div className="flex justify-between items-center">
          <span className="font-medium">Jaarlijkse besparing</span>
          <span className="text-3xl font-bold text-success">€{yearlySavings.toFixed(0)}</span>
        </div>
      </div>
    </div>
  )
}
