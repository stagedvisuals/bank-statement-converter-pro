"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Building2, CreditCard, Check } from "lucide-react";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold gradient-text">BSC Pro</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="hover:text-[var(--neon-blue)] transition-colors">Features</Link>
              <Link href="#pricing" className="hover:text-[var(--neon-blue)] transition-colors">Prijzen</Link>
              {isSignedIn ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-bold">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-bold hover:shadow-lg hover:shadow-[var(--neon-blue)]/50">
                      Start Gratis
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--neon-blue)]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--neon-purple)]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 rounded-full glass mb-6">
            <span className="text-[var(--neon-blue)] font-medium">🚀 Nieuwe Pro Versie</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="gradient-text">Bank Statement</span><br />
            <span className="text-white">Converter Pro</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Zet PDF bankafschriften automatisch om naar Excel of CSV.
            <br />
            <span className="text-[var(--neon-blue)]">Snel, veilig, en accuraat.</span>
          </p>

          <p className="text-gray-500 mb-12">
            Een product van <span className="text-white font-semibold">Artur Bagdasarjan</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href={isSignedIn ? "/dashboard" : "/register"}>
              <Button size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-bold hover:shadow-xl hover:shadow-[var(--neon-blue)]/50 transition-all transform hover:scale-105">
                {isSignedIn ? "Naar Dashboard →" : "Start Gratis Trial →"}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-white">1000+</div>
              <div className="text-gray-500">Gebruikers</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-[var(--neon-blue)]">50K+</div>
              <div className="text-gray-500">Conversies</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-[var(--neon-purple)]">99.9%</div>
              <div className="text-gray-500">Accuraat</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Waarom BSC Pro?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<Zap className="w-8 h-8" />} title="Bliksemsnel" description="Converteer 1000+ transacties in seconden. Onze AI-parser werkt in real-time." />
            <FeatureCard icon={<Shield className="w-8 h-8" />} title="100% Veilig" description="Je data wordt nooit opgeslagen. Directe conversie met end-to-end encryptie." />
            <FeatureCard icon={<Building2 className="w-8 h-8" />} title="Alle Banken" description="Ondersteuning voor ING, Rabobank, ABN AMRO, bunq, en meer." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Kies je Plan</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              title="Starter Pack"
              price="€5"
              period="eenmalig"
              features={["5 conversies", "Alle bankformaten", "CSV & Excel export", "30 dagen geldig"]}
              onClick={() => handleCheckout("starter")}
              loading={loading}
            />
            <PricingCard
              title="Unlimited"
              price="€29"
              period="per maand"
              features={["Onbeperkte conversies", "Prioriteit verwerking", "Conversie geschiedenis", "API toegang", "Support"]}
              popular
              onClick={() => handleCheckout("pro")}
              loading={loading}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-2xl font-bold gradient-text">BSC Pro</span>
              <p className="text-gray-500 mt-2">Door <span className="text-white">Artur Bagdasarjan</span></p>
            </div>
            <div className="text-gray-600">© 2025 Bank Statement Converter Pro</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass rounded-3xl p-8 hover:scale-105 transition-all duration-300">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center mb-6 text-black">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function PricingCard({ title, price, period, features, popular, onClick, loading }: any) {
  return (
    <div className={`glass rounded-3xl p-8 relative ${popular ? "border-2 border-[var(--neon-blue)]" : ""}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-1 rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black text-sm font-bold">
            POPULAIR
          </span>
        </div>
      )}
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <div className="text-5xl font-bold text-white mb-2">{price}</div>
      <p className="text-gray-500 mb-6">{period}</p>
      <ul className="space-y-4 mb-8">
        {features.map((feature: string) => (
          <li key={feature} className="flex items-center text-gray-300">
            <Check className="w-5 h-5 text-[var(--neon-blue)] mr-3" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        onClick={onClick}
        disabled={loading}
        className={`w-full py-4 rounded-full font-bold transition-all ${
          popular
            ? "bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black hover:shadow-xl hover:shadow-[var(--neon-blue)]/50"
            : "bg-gray-700 text-white hover:bg-gray-600"
        }`}
      >
        {loading ? "Laden..." : popular ? "Start Unlimited →" : "Koop Credits"}
      </Button>
    </div>
  );
}
