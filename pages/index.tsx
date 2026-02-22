'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { 
  FileText, 
  Zap, 
  Shield, 
  Check, 
  Upload, 
  Download, 
  Clock,
  TrendingUp,
  Building2,
  CreditCard,
  Receipt,
  ArrowRight
} from 'lucide-react'
import Pricing from '../components/Pricing'
import FAQ from '../components/FAQ'
import ROICalculator from '../components/ROICalculator'

// Trust Logo Component
function TrustLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center px-6 py-3 opacity-50 hover:opacity-80 transition-opacity grayscale hover:grayscale-0">
      <span className="text-lg font-bold text-slate tracking-tight">{name}</span>
    </div>
  )
}

export default function Home() {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard')
    }
  }, [isSignedIn, router])

  return (
    <div className="min-h-screen bg-fintech-bg">
      {/* Sticky Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass card-shadow' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold gradient-text">
              BSC Pro
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#hoe-werkt-het" className="text-slate hover:text-navy transition-colors font-medium">
                Hoe het werkt
              </Link>
              <Link href="#pricing" className="text-slate hover:text-navy transition-colors font-medium">
                Prijzen
              </Link>
              <Link href="#faq" className="text-slate hover:text-navy transition-colors font-medium">
                FAQ
              </Link>
              <Link 
                href="/login" 
                className="text-slate hover:text-navy transition-colors font-medium"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="px-5 py-2.5 bg-success text-white font-semibold rounded-lg hover:bg-success-dark transition-all hover:shadow-glow"
              >
                Start Gratis
              </Link>
            </div>
            <div className="md:hidden">
              <Link 
                href="/register" 
                className="px-4 py-2 bg-success text-white font-semibold rounded-lg text-sm"
              >
                Start
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-accent font-medium text-sm">AI Financial Document Processor</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy mb-6 leading-tight">
                Converteer bankafschriften, creditcards & facturen naar{' '}
                <span className="text-success">Excel/CSV</span>
              </h1>
              
              <p className="text-xl text-slate mb-8 max-w-xl">
                Upload je PDF documenten. Onze AI herkent automatisch alle transacties, 
                data en bedragen. Klaar voor je boekhouding in seconden.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  href="/register" 
                  className="px-8 py-4 bg-success text-white font-bold rounded-xl hover:bg-success-dark transition-all hover:shadow-glow text-lg text-center"
                >
                  Gratis Proberen →
                </Link>
                <Link 
                  href="#pricing" 
                  className="px-8 py-4 border-2 border-fintech-border text-navy font-semibold rounded-xl hover:bg-white transition-all text-lg text-center"
                >
                  Bekijk Prijzen
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm text-slate">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span>24u data-delete</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span>99%+ nauwkeurig</span>
                </div>
              </div>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <ROICalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-white border-y border-fintech-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate text-sm mb-6 font-medium uppercase tracking-wider">
            Vertrouwd door ondernemers uit heel Nederland
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            <TrustLogo name="ING" />
            <TrustLogo name="Rabobank" />
            <TrustLogo name="ABN AMRO" />
            <TrustLogo name="Bunq" />
            <TrustLogo name="Revolut" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="hoe-werkt-het" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Hoe Werkt Het?
            </h2>
            <p className="text-slate text-lg max-w-2xl mx-auto">
              Converteer je financiële documenten in 3 simpele stappen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 card-shadow border border-fintech-border hover:card-shadow-hover transition-all">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <Upload className="w-7 h-7 text-accent" />
              </div>
              <div className="text-sm font-bold text-accent mb-2">STAP 1</div>
              <h3 className="text-xl font-bold text-navy mb-3">Upload PDF</h3>
              <p className="text-slate">
                Sleep je bankafschrift, creditcard statement of factuur PDF in het dashboard. 
                Ondersteunt alle Nederlandse banken en formaten.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 card-shadow border border-fintech-border hover:card-shadow-hover transition-all">
              <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-success" />
              </div>
              <div className="text-sm font-bold text-success mb-2">STAP 2</div>
              <h3 className="text-xl font-bold text-navy mb-3">AI Verwerking</h3>
              <p className="text-slate">
                Onze AI analyseert automatisch alle transacties, datums, bedragen en 
                tegenpartijen met 99.2% nauwkeurigheid.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 card-shadow border border-fintech-border hover:card-shadow-hover transition-all">
              <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center mb-6">
                <Download className="w-7 h-7 text-white" />
              </div>
              <div className="text-sm font-bold text-navy mb-2">STAP 3</div>
              <h3 className="text-xl font-bold text-navy mb-3">Download Excel</h3>
              <p className="text-slate">
                Krijg een nette Excel of CSV met alle transacties, klaar voor import 
                in je boekhoudsoftware. Binnen 30 seconden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Alle Documenttypes Ondersteund
            </h2>
            <p className="text-slate text-lg max-w-2xl mx-auto">
              Van bankafschriften tot creditcard statements - wij converteren het allemaal
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-fintech-bg border border-fintech-border text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-navy mb-2">Bankafschriften</h3>
              <p className="text-sm text-slate">Alle Nederlandse banken</p>
            </div>
            
            <div className="p-6 rounded-xl bg-fintech-bg border border-fintech-border text-center">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-bold text-navy mb-2">Creditcards</h3>
              <p className="text-sm text-slate">Visa, Mastercard, Amex</p>
            </div>
            
            <div className="p-6 rounded-xl bg-fintech-bg border border-fintech-border text-center">
              <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-bold text-navy mb-2">Facturen</h3>
              <p className="text-sm text-slate">PDF facturen & bonnen</p>
            </div>
            
            <div className="p-6 rounded-xl bg-fintech-bg border border-fintech-border text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-bold text-navy mb-2">Meer formats</h3>
              <p className="text-sm text-slate">CSV, Excel export</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing />

      {/* FAQ Section */}
      <FAQ />

      {/* Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              BSC Pro vs De Rest
            </h2>
            <p className="text-slate text-lg">Waarom kiezen voor BSC Pro?</p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden card-shadow border border-fintech-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold text-success">BSC Pro</th>
                    <th className="px-6 py-4 text-center font-semibold">Concurrentie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-fintech-border">
                  <tr>
                    <td className="px-6 py-4 text-navy font-medium">Prijs per document</td>
                    <td className="px-6 py-4 text-center font-bold text-success">€2</td>
                    <td className="px-6 py-4 text-center text-slate">€3 - €5</td>
                  </tr>
                  <tr className="bg-fintech-bg/50">
                    <td className="px-6 py-4 text-navy font-medium">Maandabonnement</td>
                    <td className="px-6 py-4 text-center font-bold text-success">€15 (50 docs)</td>
                    <td className="px-6 py-4 text-center text-slate">€29 - €49</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-navy font-medium">Data verwijdering</td>
                    <td className="px-6 py-4 text-center font-bold text-success">24 uur</td>
                    <td className="px-6 py-4 text-center text-slate">Onbekend</td>
                  </tr>
                  <tr className="bg-fintech-bg/50">
                    <td className="px-6 py-4 text-navy font-medium">Nederlandse banken</td>
                    <td className="px-6 py-4 text-center font-bold text-success">✓ Allemaal</td>
                    <td className="px-6 py-4 text-center text-slate">✓ Grote banken</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-navy font-medium">API toegang</td>
                    <td className="px-6 py-4 text-center font-bold text-success">✓ Inbegrepen</td>
                    <td className="px-6 py-4 text-center text-slate">✗ Aparte kosten</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Klaar om tijd te besparen?
          </h2>
          <p className="text-slate-light text-lg mb-8 max-w-2xl mx-auto">
            Start vandaag nog met je eerste gratis conversie. Geen creditcard nodig.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-success text-white font-bold rounded-xl hover:bg-success-dark transition-all hover:shadow-glow text-lg"
            >
              Gratis Account Aanmaken
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-slate text-sm mt-6">
            ✓ 2 gratis conversies bij registratie ✓ Altijd opzegbaar
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-navy-light border-t border-navy-lighter">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">BSC Pro</div>
              <p className="text-slate text-sm">
                AI Financial Document Processor voor ondernemers. 
                Converteer bankafschriften naar Excel in seconden.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#hoe-werkt-het" className="text-slate hover:text-white transition-colors">Hoe het werkt</Link></li>
                <li><Link href="#pricing" className="text-slate hover:text-white transition-colors">Prijzen</Link></li>
                <li><Link href="#" className="text-slate hover:text-white transition-colors">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Bedrijf</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-slate hover:text-white transition-colors">Over ons</Link></li>
                <li><Link href="#" className="text-slate hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-slate hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-slate hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-slate hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-slate hover:text-white transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-navy-lighter flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate text-sm">
              © 2026 BSC Pro. Alle rechten voorbehouden.
            </p>
            <div className="flex gap-6">
              <Link href="/login" className="text-slate hover:text-white transition-colors text-sm">Login</Link>
              <Link href="/register" className="text-slate hover:text-white transition-colors text-sm">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
