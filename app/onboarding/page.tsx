'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Upload, FileText, ArrowRight, Clock, Shield } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Eenvoudige auth check zonder complexe retry logic
  useEffect(() => {
    const checkAuth = () => {
      const session = localStorage.getItem('bscpro_session')
      if (!session) {
        router.push('/')
        return
      }
      
      try {
        const { access_token } = JSON.parse(session)
        if (!access_token) {
          router.push('/')
          return
        }
        
        setAuthChecked(true)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/')
      }
    }

    checkAuth()
  }, [router])

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

  const completeOnboarding = async () => {
    setLoading(true)
    try {
      const session = localStorage.getItem('bscpro_session')
      if (!session) {
        router.push('/')
        return
      }
      const { access_token } = JSON.parse(session)
      
      const response = await fetch('/api/user/onboarding/complete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      })
      
      if (response.ok) {
        router.push('/dashboard')
      } else {
        console.error('Onboarding completion failed')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <div className="text-xl font-bold">BSC<span className="text-[#00b8d9]">PRO</span></div>
              </Link>
              <div className="hidden md:block">
                <p className="text-xs text-muted-foreground">Bank Statement Converter</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Stap {step} van 3
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-muted">
        <div 
          className="h-1 bg-[#00b8d9] transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welkom bij BSC Pro! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            Laten we je account instellen in 3 eenvoudige stappen
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Step 1 */}
          <div className={`rounded-xl p-6 border-2 ${step >= 1 ? 'border-[#00b8d9] bg-[#00b8d9]/5' : 'border-border bg-card'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#00b8d9] text-white' : 'bg-muted'}`}>
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <h3 className="text-lg font-bold">Account bevestigen</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Je account is succesvol aangemaakt. We hebben je email geverifieerd.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`rounded-xl p-6 border-2 ${step >= 2 ? 'border-[#00b8d9] bg-[#00b8d9]/5' : 'border-border bg-card'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#00b8d9] text-white' : 'bg-muted'}`}>
                {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <h3 className="text-lg font-bold">Plan kiezen</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Je hebt het <span className="font-bold">Free</span> plan. Upgrade later voor meer features.
            </p>
          </div>

          {/* Step 3 */}
          <div className={`rounded-xl p-6 border-2 ${step >= 3 ? 'border-[#00b8d9] bg-[#00b8d9]/5' : 'border-border bg-card'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#00b8d9] text-white' : 'bg-muted'}`}>
                {step > 3 ? <CheckCircle className="w-5 h-5" /> : '3'}
              </div>
              <h3 className="text-lg font-bold">Eerste conversie</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload je eerste bankafschrift en zie de magie gebeuren.
            </p>
          </div>
        </div>

        {/* Step content */}
        <div className="bg-card rounded-xl p-8 border border-border mb-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Account bevestigd ✅</h2>
              <p className="text-muted-foreground mb-6">
                Je account is succesvol aangemaakt en geverifieerd. Je hebt nu toegang tot alle features van het Free plan.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <Upload className="w-5 h-5 text-[#00b8d9] mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Upload bankafschriften</h4>
                    <p className="text-sm text-muted-foreground">PDF, CSV, of Excel bestanden</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#00b8d9] mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Automatische conversie</h4>
                    <p className="text-sm text-muted-foreground">Naar Excel, CSV, of boekhoudsoftware</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#00b8d9] mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Veilig & privé</h4>
                    <p className="text-sm text-muted-foreground">Je data wordt niet gedeeld of opgeslagen</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#00b8d9] mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Bespaar uren</h4>
                    <p className="text-sm text-muted-foreground">Automatiseer je boekhouding</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Je huidige plan: Free</h2>
              <p className="text-muted-foreground mb-6">
                Met het Free plan kun je 5 bankafschriften per maand converteren. Perfect om BSC Pro uit te proberen!
              </p>
              <div className="bg-muted rounded-lg p-6 mb-6">
                <h3 className="font-bold mb-2">Free plan features:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>5 conversies per maand</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Basis Excel & CSV export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Email support</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Je kunt altijd upgraden naar een betaald plan voor meer conversies en geavanceerde features.
              </p>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Upload je eerste bankafschrift</h2>
              <p className="text-muted-foreground mb-6">
                Probeer BSC Pro nu uit met een testbestand of upload je eigen bankafschrift.
              </p>
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center mb-6">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Sleep een PDF, CSV, of Excel bestand hierheen</p>
                <p className="text-xs text-muted-foreground mb-4">of klik om te bladeren</p>
                <button className="px-6 py-3 bg-[#00b8d9] text-white rounded-lg font-bold hover:bg-[#00a8c9] transition-colors">
                  Bestand kiezen
                </button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                We ondersteunen Rabobank, ING, ABN AMRO, en meer. Je data wordt veilig verwerkt.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              ← Vorige
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 bg-[#00b8d9] text-white rounded-lg font-bold hover:bg-[#00a8c9] transition-colors flex items-center gap-2"
            >
              Volgende stap <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={completeOnboarding}
              disabled={loading}
              className="px-8 py-3 bg-[#00b8d9] text-white rounded-lg font-bold hover:bg-[#00a8c9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Afronden...' : 'Onboarding afronden →'}
            </button>
          )}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Onboarding overslaan en naar dashboard
          </button>
        </div>
      </main>
    </div>
  )
}
