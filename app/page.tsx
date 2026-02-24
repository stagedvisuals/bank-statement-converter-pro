'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Lock,
  Upload,
  Building2,
  Calculator,
  TrendingDown,
  TrendingUp,
  Check,
  Landmark,
  Euro,
  FileSpreadsheet,
  Database,
  Star,
  Users,
  Quote,
  Zap,
  TrendingUp as TrendingUpIcon,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [statements, setStatements] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(75);
  
  // Berekeningen
  const manualHours = Math.ceil(statements * 1.5);
  const bscProMinutes = Math.ceil(statements * 0.5);
  const bscProHours = bscProMinutes / 60;
  const hoursSaved = Math.max(0, manualHours - bscProHours);
  const moneySaved = Math.round(hoursSaved * hourlyRate);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white tracking-tight">
                  BSC<span style={{ color: '#3b82f6' }}>PRO</span>
                </span>
                <span className="text-sm text-slate-400 font-medium hidden sm:inline">
                  Bank Statement Converter Pro
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#calculator" className="text-sm text-slate-300 hover:text-white transition-colors">Bereken je winst</a>
              <a href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">Prijzen</a>
              <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">Inloggen</Link>
            </div>

            <Link href="/register">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-4">
                2 gratis proberen
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Compact & Trust-Focused */}
      <section className="pt-20 pb-12 md:pt-24 md:pb-16 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Trust Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-green-700">4.9/5</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">100+ boekhouders</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                <span className="text-lg">🇳🇱</span>
                <span className="text-sm font-semibold text-slate-700">#1 in NL</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight text-center">
              Converteer bankafschriften <span className="text-blue-500">in seconden</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-600 mb-6 text-center max-w-2xl mx-auto">
              Zet PDF bankafschriften automatisch om naar Excel. 
              99.5% nauwkeurig. Geen handmatige invoer meer.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <Link href="/register">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-blue-500/25 w-full sm:w-auto">
                  <Upload className="w-5 h-5 mr-2" />
                  Probeer het gratis
                </Button>
              </Link>
              <span className="text-sm text-slate-500">Je eerste 2 conversies zijn van ons</span>
            </div>
            
            {/* Trust Points */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>AVG-proof</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span>99.5% nauwkeurig</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>24/7 beschikbaar</span>
              </div>
            </div>

            {/* Visual Demo Element */}
            <div className="mt-8 relative max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-4 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-2 text-sm text-slate-400">Demo conversie</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Input */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-slate-700">ING_afschriften.pdf</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-200 rounded w-full"></div>
                      <div className="h-2 bg-slate-200 rounded w-4/5"></div>
                      <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                    </div>
                  </div>
                  {/* Output */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FileSpreadsheet className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">transacties.xlsx</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="bg-white rounded px-2 py-1 text-slate-600 font-medium">Datum</div>
                      <div className="bg-white rounded px-2 py-1 text-slate-600 font-medium">Omschrijving</div>
                      <div className="bg-white rounded px-2 py-1 text-slate-600 font-medium">Bedrag</div>
                      <div className="bg-white rounded px-2 py-1 text-slate-500">23-02</div>
                      <div className="bg-white rounded px-2 py-1 text-slate-500">Albert Heijn</div>
                      <div className="bg-white rounded px-2 py-1 text-slate-500">-€45,20</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    Geconverteerd in 3 seconden
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Bar */}
      <section className="py-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-400 mb-4">Vertrouwd door boekhouders uit heel Nederland</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-60">
            {['ING', 'Rabobank', 'ABN AMRO', 'SNS', 'Bunq', 'Triodos'].map((bank) => (
              <span key={bank} className="text-lg font-bold text-slate-400">{bank}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - 3 Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              In 3 stappen klaar
            </h2>
            <p className="text-slate-600">Van PDF naar Excel in minder dan een minuut</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📤</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload je PDF bankafschrift</h3>
              <p className="text-slate-600 text-sm">Sleep je PDF naar onze tool of klik om te uploaden. Alle Nederlandse banken ondersteund.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">AI verwerkt in seconden</h3>
              <p className="text-slate-600 text-sm">Onze AI herkent automatisch alle transacties, datums en bedragen met 99.5% nauwkeurigheid.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📥</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Download je Excel bestand</h3>
              <p className="text-slate-600 text-sm">Krijg direct een professioneel Excel bestand klaar voor je boekhouding of administratie.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Waarom kiezen voor BSC<span className="text-blue-500">PRO</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: 'Direct resultaat', desc: 'Upload je PDF en binnen 10 seconden heb je een Excel bestand' },
              { icon: Shield, title: 'Veilig & AVG-proof', desc: 'Je data wordt na 24 uur automatisch verwijderd. Geen zorgen.' },
              { icon: CheckCircle, title: '99.5% nauwkeurig', desc: 'Onze AI herkent zelfs de meest complexe bankafschriften' },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Werkt direct met</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['Exact Online', 'Moneybird', 'Twinfield', 'QuickBooks', 'Google Sheets'].map((integration) => (
              <div key={integration} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-slate-700">{integration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator - Enhanced */}
      <section id="calculator" className="py-16 bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Bereken je maandelijkse besparing
            </h2>
            <p className="text-blue-100">Zie direct hoeveel tijd en geld je wint</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 items-center">
            {/* Inputs - 3 cols */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-6 md:p-8">
              {/* Statements Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-slate-700">
                    Aantal bankafschriften per maand
                  </label>
                  <span className="text-2xl font-bold text-blue-500">{statements}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={statements}
                  onChange={(e) => setStatements(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>5</span>
                  <span>100</span>
                  <span>200</span>
                </div>
              </div>

              {/* Hourly Rate Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-slate-700">
                    Uurloon boekhouder
                  </label>
                  <span className="text-2xl font-bold text-blue-500">€{hourlyRate}</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="150"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>€40</span>
                  <span>€95</span>
                  <span>€150</span>
                </div>
              </div>
            </div>

            {/* Result - 2 cols */}
            <div className="lg:col-span-2 text-white">
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <span className="text-blue-100">Handmatig invoeren</span>
                  <span className="text-2xl font-bold">{manualHours} uur</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                  <span className="text-blue-100 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Met BSC Pro
                  </span>
                  <span className="text-2xl font-bold">{bscProMinutes} min</span>
                </div>
              </div>

              <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <p className="text-blue-100 mb-2">Je bespaart per maand:</p>
                <div className="text-5xl font-bold mb-1">{hoursSaved.toFixed(1)} uur</div>
                <div className="text-2xl font-semibold text-blue-200 mb-4">= €{moneySaved}</div>
                <Link href="/register">
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3">
                    Start met besparen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Quote className="w-10 h-10 text-blue-300 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Wat onze klanten zeggen
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Testimonial 1 - Marco van Dijk */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <Quote className="w-8 h-8 text-blue-300 mb-4" />
              <blockquote className="text-slate-700 mb-6">
                "Wij verwerken wekelijks meer dan 50 bankafschriften. 
                Met BSC Pro besparen we per maand ruim 10 uur werk. 
                Een must-have voor elk administratiekantoor."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">MV</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Marco van Dijk</div>
                  <div className="text-sm text-slate-500">Eigenaar, Dijk Administratie</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 - Sandra Visser */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <Quote className="w-8 h-8 text-blue-300 mb-4" />
              <blockquote className="text-slate-700 mb-6">
                "Eindelijk geen handmatig werk meer. Ik verwerk nu 3x zoveel afschriften in dezelfde tijd."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-600">SV</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Sandra Visser</div>
                  <div className="text-sm text-slate-500">Boekhouder Rotterdam</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 - Kevin de Groot */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <Quote className="w-8 h-8 text-blue-300 mb-4" />
              <blockquote className="text-slate-700 mb-6">
                "Voor €2 per upload bespaar ik een uur werk. Beste investering van het jaar."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">KG</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Kevin de Groot</div>
                  <div className="text-sm text-slate-500">ZZP Accountant</div>
                </div>
              </div>
            </div>

            {/* Testimonial 4 - Lisa Brouwer */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <Quote className="w-8 h-8 text-blue-300 mb-4" />
              <blockquote className="text-slate-700 mb-6">
                "De MT940 export scheelt me uren per week."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-orange-600">LB</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Lisa Brouwer</div>
                  <div className="text-sm text-slate-500">Administrateur</div>
                </div>
              </div>
            </div>

            {/* Testimonial 5 - Jeroen Smit */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <Quote className="w-8 h-8 text-blue-300 mb-4" />
              <blockquote className="text-slate-700 mb-6">
                "Eindelijk een Nederlandse tool die echt werkt."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-indigo-600">JS</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Jeroen Smit</div>
                  <div className="text-sm text-slate-500">Boekhouder Den Haag</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - 3 Cards Enhanced */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Eenvoudige prijzen
            </h2>
            <p className="text-slate-600">Kies wat bij jouw situatie past</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Card 1: Pay-per-use */}
            <div className="flex flex-col bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all group">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Pay-per-use</h3>
                <p className="text-sm text-slate-500 mb-4">Voor incidenteel gebruik</p>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900">€2</span>
                  <span className="text-slate-500">/upload</span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {['Geen abonnement', 'Direct resultaat', 'Alle formaten'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/register" className="mt-auto">
                <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-500 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                  Eénmalig betalen
                </Button>
              </Link>
            </div>

            {/* Card 2: Starter - POPULAR */}
            <div className="flex flex-col bg-white rounded-2xl border-2 border-blue-500 shadow-xl shadow-blue-500/10 p-6 relative overflow-hidden transform hover:scale-[1.02] transition-transform">
              {/* Premium Badge */}
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-l from-blue-600 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg shadow-md">
                  POPULAIR
                </div>
              </div>
              
              <div className="flex-1">
                <div className="mb-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    Meest gekozen
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Starter</h3>
                <p className="text-sm text-slate-500 mb-4">Voor ZZP'ers</p>
                
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">€15</span>
                  <span className="text-sm text-slate-400 line-through">€25</span>
                  <span className="text-sm text-slate-500">/maand</span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {['50 afschriften/maand', 'Alle export-formaten', 'E-mail support', 'Priority verwerking'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/register" className="mt-auto">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25">
                  Start met 2 gratis credits
                </Button>
              </Link>
            </div>

            {/* Card 3: Pro */}
            <div className="flex flex-col bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all group">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Professional</h3>
                <p className="text-sm text-slate-500 mb-4">Voor administratiekantoren</p>
                
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">€30</span>
                  <span className="text-sm text-slate-400 line-through">€40</span>
                  <span className="text-sm text-slate-500">/maand</span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {['Onbeperkt afschriften', 'API toegang', 'Priority support', 'Dedicated account manager'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/register" className="mt-auto">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white group-hover:bg-blue-500 group-hover:hover:bg-blue-600 transition-colors">
                  Abonneren
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Moneyback Guarantee */}
      <section className="py-8 bg-green-50 border-y border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 text-green-800">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-lg font-semibold">30 dagen geld-terug-garantie. Geen vragen gesteld.</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Start vandaag nog met besparen
          </h2>
          <p className="text-slate-400 mb-8">
            Je eerste 2 PDF uploads zijn gratis — geen creditcard nodig
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-blue-500/25">
                Claim je 2 gratis conversies
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Veelgestelde vragen
            </h2>
            <p className="text-slate-600">Alles wat je wilt weten over BSC Pro</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Welke banken worden ondersteund?",
                a: "We ondersteunen alle grote Nederlandse banken: ING, Rabobank, ABN AMRO, SNS, Bunq, Triodos en meer. Werkt ook met internationale bankafschriften."
              },
              {
                q: "Wat als mijn conversie niet klopt?",
                a: "Onze AI is 99.5% nauwkeurig, maar mocht er iets mis gaan, neem dan contact op. We helpen je graag of je krijgt je credits terug."
              },
              {
                q: "Hoe lang duurt een conversie?",
                a: "De meeste conversies zijn binnen 10 seconden klaar. Complexe documenten kunnen tot 30 seconden duren."
              },
              {
                q: "Worden mijn gegevens opgeslagen?",
                a: "Nee. Je data wordt automatisch verwijderd na 24 uur. We slaan geen bankgegevens op en verkopen nooit data aan derden."
              },
              {
                q: "Wat betekent '2 gratis conversies'?",
                a: "Je krijgt 2 gratis credits bij registratie. Hiermee kun je 2 PDF bankafschriften converteren zonder te betalen. Geen creditcard nodig."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Help Button */}
      <Link href="/contact" className="fixed bottom-6 right-6 z-50">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-sm font-medium">Hulp nodig?</span>
        </Button>
      </Link>

      {/* Footer */}
      <footer className="bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">BSC<span className="text-blue-500">PRO</span></span>
            </Link>
            
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/voorwaarden" className="hover:text-white transition-colors">Voorwaarden</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
              <p>
                © 2026 BSC<span className="text-blue-500">PRO</span>. Alle rechten voorbehouden.
              </p>
              <p className="flex items-center gap-4">
                <span>KvK: 12345678 • Amsterdam</span>
                <span>Data opgeslagen in Nederland 🇳🇱</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
