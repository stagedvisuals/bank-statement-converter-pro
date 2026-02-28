'use client'

import { useState } from 'react'
import { Calculator, Zap } from 'lucide-react'

export default function ROICalculator() {
  const [documents, setDocuments] = useState(20)
  const [hourlyRate, setHourlyRate] = useState(75)
  const timePerDoc = 5 // minutes per document manually
  const costPerDoc = 2 // €2 per document with BSC Pro
  
  const monthlyHoursSaved = (documents * timePerDoc) / 60
  const monthlyMoneySaved = (monthlyHoursSaved * hourlyRate) - (documents * costPerDoc)
  const yearlySavings = monthlyMoneySaved * 12
  
  return (
    <div className="rounded-2xl p-8" style={{ background: 'rgba(10, 18, 32, 0.8)', border: '1px solid rgba(0, 184, 217, 0.15)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0, 184, 217, 0.1)' }}>
          <Calculator className="w-6 h-6" style={{ color: '#00b8d9' }} />
        </div>
        <div>
          <h3 className="text-xl font-bold" style={{ color: '#e8edf5' }}>ROI Calculator</h3>
          <p className="text-sm" style={{ color: '#6b7fa3' }}>Bereken je maandelijkse besparing</p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="font-medium" style={{ color: '#e8edf5' }}>Documenten per maand</label>
          <span className="text-2xl font-bold" style={{ color: '#00b8d9' }}>{documents}</span>
        </div>
        <input
          type="range"
          min="5"
          max="200"
          value={documents}
          onChange={(e) => setDocuments(parseInt(e.target.value))}
          className="w-full"
          style={{ accentColor: '#00b8d9' }}
        />
        <div className="flex justify-between text-sm mt-2" style={{ color: '#6b7fa3' }}>
          <span>5 docs</span>
          <span>200+ docs</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="font-medium" style={{ color: '#e8edf5' }}>Uurloon (€)</label>
          <span className="text-2xl font-bold" style={{ color: '#00b8d9' }}>€{hourlyRate}</span>
        </div>
        <input
          type="range"
          min="30"
          max="150"
          step="5"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(parseInt(e.target.value))}
          className="w-full"
          style={{ accentColor: '#00b8d9' }}
        />
        <div className="flex justify-between text-sm mt-2" style={{ color: '#6b7fa3' }}>
          <span>€30</span>
          <span>€150</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl" style={{ background: 'rgba(8, 13, 20, 0.6)' }}>
          <p className="text-sm mb-1" style={{ color: '#6b7fa3' }}>Tijdsbesparing</p>
          <p className="text-2xl font-bold" style={{ color: '#e8edf5' }}>{monthlyHoursSaved.toFixed(1)}u</p>
          <p className="text-xs" style={{ color: '#6b7fa3' }}>per maand</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'rgba(0, 184, 217, 0.1)' }}>
          <p className="text-sm mb-1" style={{ color: '#00b8d9' }}>Geldbesparing</p>
          <p className="text-2xl font-bold" style={{ color: '#00b8d9' }}>€{monthlyMoneySaved.toFixed(0)}</p>
          <p className="text-xs" style={{ color: '#00b8d9' }}>per maand</p>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(0, 184, 217, 0.15)', border: '1px solid rgba(0, 184, 217, 0.3)' }}>
        <div className="flex justify-between items-center">
          <span className="font-medium" style={{ color: '#e8edf5' }}>Jaarlijkse besparing</span>
          <span className="text-3xl font-bold" style={{ color: '#00b8d9' }}>€{yearlySavings.toFixed(0)}</span>
        </div>
      </div>
    </div>
  )
}
