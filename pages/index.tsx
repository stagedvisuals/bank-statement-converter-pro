'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
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
  ArrowRight,
  Brain,
  PieChart,
  Edit3,
  Info
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
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem('bscpro_session')
    setIsLoggedIn(!!session)
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard')
    }
  }, [isLoggedIn, router])

  return (
    <>
      <Head>
        <title>BSC Pro | De Snelste Bank Statement Converter (PDF naar Excel)</title>
        <meta name="description" content="Zet bankafschriften in seconden om naar Excel, CSV of JSON. Veilig, snel en AI-gestuurd. Ondersteunt alle Nederlandse banken." />
        <meta name="keywords" content="Bank statement converter, PDF naar Excel bankafschrift, bankgegevens extraheren, bankafschriften converteren, Excel export bank, PDF naar CSV, boekhouding automatisering, financiële data extractie, ING Rabobank ABN AMRO export" />
        <meta property="og:title" content="BSC Pro | De Snelste Bank Statement Converter (PDF naar Excel)" />
        <meta property="og:description" content="Zet bankafschriften in seconden om naar Excel, CSV of JSON. Veilig, snel en AI-gestuurd." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.bscpro.nl" />
        <meta property="og:image" content="https://www.bscpro.nl/images/logo.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BSC Pro | De Snelste Bank Statement Converter" />
        <meta name="twitter:description" content="Zet bankafschriften in seconden om naar Excel, CSV of JSON." />
        <meta name="twitter:image" content="https://www.bscpro.nl/images/logo.jpg" />
        <link rel="canonical" href="https://www.bscpro.nl/" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
      </Head>
      <div className="min-h-screen bg-fintech-bg">
      {/* Sticky Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass card-shadow' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/images/logo.jpg" 
                alt="BSC Pro Logo" 
                className="h-10 w-auto rounded-lg"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold gradient-text">BSC Pro</span>
                <span className="text-xs text-slate">Bank Statement Converter</span>
              </div>
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
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="/images/logo.jpg" 
                  alt="BSC Pro Logo" 
                  className="h-20 w-auto rounded-xl shadow-lg"
                />
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-accent font-medium text-sm">AI Financial Document Processor</span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy mb-6 leading-tight">
                De slimste manier om bankafschriften te converteren naar{' '}
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
            Ondersteunde bankformaten:
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

      {/* Over Ons Section */}
      <section id="over-ons" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <Info className="w-4 h-4 text-accent" />
            <span className="text-accent font-medium text-sm">Over Ons</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6">
            Wat is BSC Pro?
          </h2>
          <p className="text-lg text-slate leading-relaxed mb-6">
            <strong>BSC Pro</strong> staat voor <strong>Bank Statement Converter Pro</strong>. Wij zijn een innovatief Nederlands bedrijf dat gebruik maakt van kunstmatige intelligentie om bankafschriften automatisch om te zetten naar overzichtelijke Excel- en CSV-bestanden.
          </p>
          <p className="text-lg text-slate leading-relaxed">
            Onze AI-technologie herkent transacties, categoriseert uitgaven en detecteert onregelmatigheden - bespaar uren werk en voorkom fouten in je boekhouding. Geschikt voor alle Nederlandse banken en volledig GDPR-compliant.
          </p>
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

      {/* AI Intelligence Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
              <Brain className="w-4 h-4 text-accent" />
              <span className="text-accent font-medium text-sm">AI Financial Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Meer dan alleen Converteren
            </h2>
            <p className="text-slate text-lg max-w-2xl mx-auto">
              Onze AI analyseert je financiële data en geeft direct bruikbare inzichten
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-fintech-bg border border-fintech-border text-center hover:card-shadow-hover transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-navy mb-2">Smart Categorisatie</h3>
              <p className="text-sm text-slate">AI herkent automatisch Huisvesting, Marketing, Personeel en meer</p>
            </div>
            
            <div className="p-6 rounded-xl bg-fintech-bg border border-fintech-border text-center hover:card-shadow-hover transition-all">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-bold text-navy mb-2">AI Fraude Detectie</h3>
              <p className="text-sm text-slate">Detecteert dubbele transacties en verdachte patronen automatisch</p>
            </div>
            
            <div className="p-6 rounded-xl bg-fintech-bg border border-fintech-border text-center hover:card-shadow-hover transition-all">
              <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-bold text-navy mb-2">Directe Insights</h3>
              <p className="text-sm text-slate">Zie direct je grootste kostenposten en cashflow analyse</p>
            </div>
            
            <div className="p-6 rounded-xl bg-fintech-bg border border-fintech-border text-center hover:card-shadow-hover transition-all">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-bold text-navy mb-2">Preview & Bewerk</h3>
              <p className="text-sm text-slate">Controleer en corrigeer AI resultaten voordat je exporteert</p>
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
                <li><Link href="/#hoe-werkt-het" className="text-slate hover:text-white transition-colors">Hoe het werkt</Link></li>
                <li><Link href="/#pricing" className="text-slate hover:text-white transition-colors">Prijzen</Link></li>
                <li><Link href="/api-docs" className="text-slate hover:text-white transition-colors">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Bedrijf</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#over-ons" className="text-slate hover:text-white transition-colors">Over ons</Link></li>
                <li><Link href="mailto:info@bscpro.nl" className="text-slate hover:text-white transition-colors">Contact: info@bscpro.nl</Link></li>
                <li><span className="text-slate">Bank Statement Converter Pro</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-slate hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-slate hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/gdpr" className="text-slate hover:text-white transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-navy-lighter flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate text-sm">
              © 2026 Bank Statement Converter Pro. Alle rechten voorbehouden.
            </p>
            <div className="flex gap-6">
              <Link href="/login" className="text-slate hover:text-white transition-colors text-sm">Login</Link>
              <Link href="/register" className="text-slate hover:text-white transition-colors text-sm">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
