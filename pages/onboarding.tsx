'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Check, 
  ChevronRight, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  Users,
  Wrench,
  ArrowRight,
  Upload
} from 'lucide-react';
import { BEROEP_OPTIES, AFSCHRIFTEN_OPTIES, type Beroep } from '@/types/user-profile';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<'free' | 'starter' | 'pro'>('free');
  
  // Form data
  const [formData, setFormData] = useState({
    beroep: null as Beroep | null,
    bedrijfsnaam: '',
    kvk_nummer: '',
    btw_nummer: '',
    afschriften_per_maand: null as number | null,
    // Instellingen
    instelling_btw_categorisering: true,
    instelling_bedrijfsnaam_in_excel: true,
    instelling_lopend_saldo: true,
    instelling_logo_in_excel: false,
    instelling_kostenplaats: false,
  });

  useEffect(() => {
    // Haal huidige subscription op (mock voor nu)
    const fetchSubscription = async () => {
      // In productie: fetch van API
      setSubscription('starter');
    };
    fetchSubscription();
  }, []);

  const handleBeroepSelect = (beroep: Beroep) => {
    setFormData({ ...formData, beroep });
  };

  const handleInstellingToggle = (key: keyof typeof formData) => {
    setFormData({ ...formData, [key]: !formData[key] });
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
      if (step === 3) {
        // Confetti bij stap 4
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00d4ff', '#0066cc', '#ffffff']
        });
        
        // Sla profiel op
        await saveProfile();
      }
    } else {
      router.push('/dashboard');
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          onboarding_voltooid: true,
        }),
      });
      
      if (!response.ok) {
        console.error('Error saving profile');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.beroep !== null;
      case 2:
        return formData.bedrijfsnaam.trim() !== '';
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  };

  const progress = ((step - 1) / 3) * 100;

  return (
    <>
      <Head>
        <title>Welkom bij BSCPro | Onboarding</title>
      </Head>
      
      <div style={{ minHeight: '100vh', background: '#080d14', padding: '24px' }}>
        {/* Progress Bar */}
        <div style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Stap {step} van 3</span>
            <span style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 600 }}>
              {step === 1 && 'Wie ben je?'}
              {step === 2 && 'Je bedrijf'}
              {step === 3 && 'Instellingen'}
              {step === 4 && 'Klaar!'}
            </span>
          </div>
          <div style={{ height: '4px', background: 'rgba(0,212,255,0.1)', borderRadius: '2px' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%', background: '#00d4ff', borderRadius: '2px' }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: 700, 
                  color: '#ffffff', 
                  textAlign: 'center',
                  marginBottom: '32px',
                  fontFamily: 'var(--font-syne), Syne, sans-serif'
                }}>
                  Wie ben je?
                </h1>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {BEROEP_OPTIES.map((optie) => (
                    <button
                      key={optie.value}
                      onClick={() => handleBeroepSelect(optie.value)}
                      style={{
                        padding: '24px',
                        borderRadius: '12px',
                        border: formData.beroep === optie.value 
                          ? '2px solid #00d4ff' 
                          : '1px solid rgba(0,212,255,0.2)',
                        background: formData.beroep === optie.value 
                          ? 'rgba(0,212,255,0.1)' 
                          : 'rgba(10,18,32,0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{optie.emoji}</div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                        {optie.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {optie.description}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: 700, 
                  color: '#ffffff', 
                  textAlign: 'center',
                  marginBottom: '32px',
                  fontFamily: 'var(--font-syne), Syne, sans-serif'
                }}>
                  Je bedrijf
                </h1>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                      Bedrijfsnaam *
                    </label>
                    <input
                      type="text"
                      value={formData.bedrijfsnaam}
                      onChange={(e) => setFormData({ ...formData, bedrijfsnaam: e.target.value })}
                      placeholder="Jouw bedrijf B.V."
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(10,18,32,0.6)',
                        border: '1px solid rgba(0,212,255,0.2)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                      KvK nummer
                    </label>
                    <input
                      type="text"
                      value={formData.kvk_nummer}
                      onChange={(e) => setFormData({ ...formData, kvk_nummer: e.target.value })}
                      placeholder="12345678"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(10,18,32,0.6)',
                        border: '1px solid rgba(0,212,255,0.2)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                      BTW nummer
                    </label>
                    <input
                      type="text"
                      value={formData.btw_nummer}
                      onChange={(e) => setFormData({ ...formData, btw_nummer: e.target.value })}
                      placeholder="NL123456789B01"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(10,18,32,0.6)',
                        border: '1px solid rgba(0,212,255,0.2)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#ffffff', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                      Afschriften per maand
                    </label>
                    <select
                      value={formData.afschriften_per_maand || ''}
                      onChange={(e) => setFormData({ ...formData, afschriften_per_maand: e.target.value ? parseInt(e.target.value) : null })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(10,18,32,0.6)',
                        border: '1px solid rgba(0,212,255,0.2)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    >
                      <option value="">Selecteer...</option>
                      {AFSCHRIFTEN_OPTIES.map((optie) => (
                        <option key={optie.value} value={optie.value}>{optie.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: 700, 
                  color: '#ffffff', 
                  textAlign: 'center',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-syne), Syne, sans-serif'
                }}>
                  Instellingen
                </h1>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '32px' }}>
                  Pas aan hoe je exports eruit zien
                </p>

                {subscription === 'free' ? (
                  <div style={{
                    padding: '24px',
                    background: 'rgba(0,212,255,0.05)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>⭐</div>
                    <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                      Upgrade naar Starter
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
                      Krijg toegang tot geavanceerde instellingen zoals logo in Excel en kostenplaats codes.
                    </p>
                    <button
                      onClick={() => router.push('/pricing')}
                      style={{
                        padding: '12px 24px',
                        background: '#00d4ff',
                        color: '#080d14',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Bekijk prijzen
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { key: 'instelling_btw_categorisering', label: 'BTW categorisering automatisch' },
                      { key: 'instelling_bedrijfsnaam_in_excel', label: 'Bedrijfsnaam in Excel header' },
                      { key: 'instelling_lopend_saldo', label: 'Lopend saldo kolom' },
                      { key: 'instelling_logo_in_excel', label: 'Logo uploaden in Excel' },
                      { key: 'instelling_kostenplaats', label: 'Kostenplaats codes' },
                    ].map((instelling) => (
                      <div
                        key={instelling.key}
                        onClick={() => handleInstellingToggle(instelling.key as keyof typeof formData)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px 20px',
                          background: 'rgba(10,18,32,0.6)',
                          border: '1px solid rgba(0,212,255,0.2)',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ color: '#ffffff', fontSize: '15px' }}>{instelling.label}</span>
                        <div style={{
                          width: '48px',
                          height: '26px',
                          borderRadius: '13px',
                          background: formData[instelling.key as keyof typeof formData] ? '#00d4ff' : 'rgba(100,116,139,0.3)',
                          position: 'relative',
                          transition: 'background 0.2s'
                        }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#ffffff',
                            position: 'absolute',
                            top: '3px',
                            left: formData[instelling.key as keyof typeof formData] ? '25px' : '3px',
                            transition: 'left 0.2s'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(0,212,255,0.1)',
                  border: '2px solid #00d4ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <Check style={{ width: '40px', height: '40px', color: '#00d4ff' }} />
                </div>
                
                <h1 style={{ 
                  fontSize: '28px', 
                  fontWeight: 700, 
                  color: '#ffffff', 
                  marginBottom: '16px',
                  fontFamily: 'var(--font-syne), Syne, sans-serif'
                }}>
                  Welkom bij BSCPro, {formData.bedrijfsnaam}!
                </h1>
                
                <p style={{ color: '#94a3b8', marginBottom: '32px' }}>
                  Je account is helemaal klaar. Start direct met je eerste conversie.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {step < 4 && (
            <button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              style={{
                width: '100%',
                marginTop: '32px',
                padding: '14px 24px',
                background: canProceed() && !loading ? '#00d4ff' : 'rgba(100,116,139,0.3)',
                color: canProceed() && !loading ? '#080d14' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: canProceed() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? 'Bezig...' : (
                <>
                  {step === 3 ? 'Afronden' : 'Volgende'}
                  <ArrowRight style={{ width: '18px', height: '18px' }} />
                </>
              )}
            </button>
          )}

          {step === 4 && (
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                width: '100%',
                marginTop: '32px',
                padding: '14px 24px',
                background: '#00d4ff',
                color: '#080d14',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Start je eerste conversie
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
