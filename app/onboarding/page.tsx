'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Upload, FileText, Download, ArrowRight, Sparkles } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    let cancelled = false
    let retryCount = 0
    const maxRetries = 3

    const checkAuth = () => {
      if (cancelled) return
      
      const session = localStorage.getItem('bscpro_session')
      if (!session) {
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(checkAuth, 500)
          return
        }
        // Geen sessie gevonden na retries, redirect naar login
        router.push('/')
        return
      }
      
      try {
        const { access_token } = JSON.parse(session)
        if (!access_token) {
          if (retryCount < maxRetries) {
            retryCount++
            setTimeout(checkAuth, 500)
            return
          }
          router.push('/')
          return
        }
        
        // Auth is geldig
        if (!cancelled) {
          setAuthChecked(true)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(checkAuth, 1000)
          return
        }
        router.push('/')
      }
    }

    checkAuth()
      // Loading/Auth check
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00b8d9] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Onboarding laden...</p>
        </div>
      </div>
    )
  }

return () => { cancelled = true }
  }, [router])

  const completeOnboarding = async () => {
    setLoading(true)
    try {
      const session = localStorage.getItem('bscpro_session')
      if (!session) {
        router.push('/dashboard')
        return
      }
      const { access_token } = JSON.parse(session)
      
      await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ step: 'completed', progress: 100 })
      })
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding completion error:', error)
      router.push('/dashboard')
    }
  }

  const steps = [
    {
      icon: <Sparkles className="w-8 h-8 text-[#00b8d9]" />,
      title: "Welkom bij BSCPro!",
      description: "Je slimste keuze voor bankafschrift conversie. Laten we je snel wegwijs maken.",
      action: "Start rondleiding"
    },
    {
      icon: <Upload className="w-8 h-8 text-[#00b8d9]" />,
      title: "1. Upload je PDF",
      description: "Sleep eenvoudig je bankafschrift naar het dashboard. We accepteren PDF's van alle Nederlandse banken.",
      action: "Volgende"
    },
    {
      icon: <FileText className="w-8 h-8 text-[#00b8d9]" />,
      title: "2. AI doet het werk",
      description: "Onze AI herkent automatisch alle transacties, datums, bedragen en omschrijvingen. Geen handmatig werk meer!",
      action: "Volgende"
    },
    {
      icon: <Download className="w-8 h-8 text-[#00b8d9]" />,
      title: "3. Download je bestand",
      description: "Kies uit Excel, CSV, MT940 of CAMT.053 formaat. Direct klaar voor je boekhouding!",
      action: "Volgende"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-[#00b8d9]" />,
      title: "Je hebt 2 gratis conversies!",
      description: "Probeer BSCPro direct uit met je gratis credits. Daarna kun je eenvoudig upgraden.",
      action: "Naar dashboard"
    }
  ]

  const currentStep = steps[step - 1]

  return (
    <div className="min-h-screen bg-[#080d14] flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-1 rounded-full transition-colors ${
                idx + 1 <= step ? 'bg-[#00b8d9]' : 'bg-gray-800'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-[#00b8d9]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            {currentStep.icon}
          </div>

          <h1 className="text-2xl font-bold mb-4">{currentStep.title}</h1>
          <p className="text-muted-foreground mb-8">{currentStep.description}</p>

          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-4 py-3 border border-border rounded-xl hover:bg-accent transition-colors"
              >
                Terug
              </button>
            )}
            <button
              onClick={() => {
                if (step < steps.length) {
                  setStep(step + 1)
                } else {
                  completeOnboarding()
                }
              }}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[#00b8d9] text-[#080d14] rounded-xl font-bold hover:bg-[#00a8c9] transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Laden...' : currentStep.action}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Skip option */}
          <button
            onClick={completeOnboarding}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Rondleiding overslaan →
          </button>
        </div>

        {/* Features preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#00b8d9]">AI</p>
            <p className="text-xs text-muted-foreground">Slimme herkenning</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#00b8d9]">5+</p>
            <p className="text-xs text-muted-foreground">Export formaten</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#00b8d9]">100%</p>
            <p className="text-xs text-muted-foreground">Nederlands</p>
          </div>
        </div>
      </div>
    </div>
  )
}
