'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown, ArrowRight, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: 'De Starter Deal',
    subtitle: 'Voor de slimme ondernemer',
    originalPrice: 25,
    price: 15,
    period: '/maand',
    popular: true,
    badge: 'LANCERINGSAANBIEDING',
    features: [
      '50 conversies per maand',
      'AI-powered parsing',
      'Export naar Excel & CSV',
      'E-mail support',
      '99.5% accuracy garantie',
    ],
    cta: 'Kies dit plan',
    color: 'from-teal-500 to-cyan-600',
    bgGlow: 'bg-teal-500/20',
    priceColor: 'text-teal-400',
  },
  {
    name: 'De Pro Pioneer',
    subtitle: 'Volledige kracht, tijdelijk voor een fractie van de prijs',
    originalPrice: 40,
    price: 30,
    period: '/maand',
    popular: false,
    badge: 'LIMITED TIME',
    features: [
      'Onbeperkte conversies',
      'Prioriteit processing',
      'API toegang',
      '24/7 Priority support',
      'Advanced analytics',
      'White-label exports',
    ],
    cta: 'Kies dit plan',
    color: 'from-purple-500 to-pink-600',
    bgGlow: 'bg-purple-500/20',
    priceColor: 'text-purple-400',
  },
];

// Shimmer animation for badges
const shimmer = {
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 2s infinite',
};

export function LaunchPricing() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Badge */}
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/30 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 font-semibold text-sm tracking-wide">EARLY BIRD SPECIAL</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Launch <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">Deal</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
              Profiteer nu van onze introductieprijzen. Slechts beschikbaar voor de eerste 100 pioniers.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className={`relative rounded-3xl overflow-hidden ${
                plan.popular 
                  ? 'ring-2 ring-teal-500/50 shadow-2xl shadow-teal-500/20' 
                  : 'ring-1 ring-purple-500/30 shadow-2xl shadow-purple-500/10'
              }`}
            >
              {/* Card Background with Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800/80 to-slate-900/95" />
              
              {/* Glow Effect */}
              <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 ${plan.bgGlow} rounded-full blur-[60px]`} />

              {/* Glimmende Badge */}
              <motion.div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                initial={{ y: -10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  {/* Glow behind badge */}
                  <div className={`absolute inset-0 ${plan.popular ? 'bg-amber-500' : 'bg-purple-500'} blur-xl opacity-50`} />
                  <Badge 
                    className={`relative px-4 py-1.5 text-xs font-bold border-0 shadow-lg ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/50' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/50'
                    }`}
                  >
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {plan.badge}
                    <Star className="w-3 h-3 ml-1 fill-current" />
                  </Badge>
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  />
                </div>
              </motion.div>

              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl z-10">
                  MEEST GEKOZEN
                </div>
              )}

              <div className="relative p-8 pt-10">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <motion.h3 
                    className="text-2xl md:text-3xl font-bold text-white mb-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    {plan.name}
                  </motion.h3>
                  <p className="text-slate-400 text-sm md:text-base">{plan.subtitle}</p>
                </div>

                {/* Price Section */}
                <div className="text-center mb-8 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                  {/* Original Price with strikethrough */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl text-slate-500 line-through decoration-red-500/50 decoration-2">
                      €{plan.originalPrice}
                    </span>
                    <span className="text-sm text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full">
                      normaal
                    </span>
                  </div>
                  
                  {/* Current Price */}
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-slate-400 text-2xl font-medium">€</span>
                    <span className={`text-6xl md:text-7xl font-bold ${plan.priceColor} bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                      {plan.price}
                    </span>
                    <span className="text-slate-400 text-lg">{plan.period}</span>
                  </div>
                  
                  {/* Savings */}
                  <motion.div 
                    className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold text-sm">
                      Bespaar €{plan.originalPrice - plan.price}/maand
                    </span>
                  </motion.div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-slate-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button with enhanced hover effects */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative"
                >
                  {/* Button glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity`} />
                  <Button 
                    className={`relative w-full bg-gradient-to-r ${plan.color} hover:brightness-110 text-white py-7 text-lg font-bold group overflow-hidden rounded-xl border-0 shadow-xl`}
                  >
                    {/* Animated background on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {plan.cta}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Urgency Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-400">
              <Clock className="w-5 h-5 animate-pulse" />
              <Crown className="w-5 h-5" />
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <p className="text-amber-200/90 text-base md:text-lg max-w-xl text-center font-medium">
              Alleen geldig voor de eerste <span className="text-amber-400 font-bold">100 pioniers</span>. 
              Mis deze kans niet om levenslang van dit tarief te profiteren.
            </p>
            <div className="flex items-center gap-2 text-sm text-amber-500/70">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span>Beperkte beschikbaarheid - Reserveer nu je plek</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add keyframe animation for shimmer */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
}
