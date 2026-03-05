'use client';

import Link from 'next/link';
import { Shield, Trash2, Globe, Lock, CheckCircle, ArrowLeft, Mail, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function BeveiligingPage() {
  const trustCards = [
    {
      icon: Trash2,
      title: 'Data binnen 1 uur verwijderd',
      description: 'Je PDF wordt automatisch verwijderd na verwerking. Wij bewaren nooit je bankgegevens.',
      color: '#00b8d9'
    },
    {
      icon: Globe,
      title: 'EU Servers',
      description: 'Al je data wordt verwerkt op Europese servers. Voldoet aan AVG/GDPR wetgeving.',
      color: '#00b8d9'
    },
    {
      icon: Lock,
      title: 'HTTPS Encryptie',
      description: 'Alle verbindingen zijn beveiligd met 256-bit SSL encryptie.',
      color: '#00b8d9'
    },
    {
      icon: CheckCircle,
      title: 'AVG Compliant',
      description: 'BSCPro voldoet volledig aan de Algemene Verordening Gegevensbescherming.',
      color: '#00b8d9'
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: '#080d14' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '60px', background: '#080d14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(0, 184, 217, 0.1)', 
              border: '1px solid rgba(0, 184, 217, 0.2)', 
              borderRadius: '999px', 
              padding: '8px 16px',
              marginBottom: '24px'
            }}>
              <Shield className="w-4 h-4" style={{ color: '#00b8d9' }} />
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#00b8d9' }}>Veiligheid & Privacy</span>
            </div>

            <h1 style={{
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '16px',
              lineHeight: 1.1,
              fontFamily: 'var(--font-syne), Syne, sans-serif',
              fontSize: 'clamp(32px, 6vw, 56px)'
            }}>
              Jouw data is veilig bij <span style={{ color: '#00b8d9' }}>BSCPro</span>
            </h1>

            <p style={{ 
              fontSize: '18px', 
              color: '#6b7fa3', 
              maxWidth: '600px', 
              margin: '0 auto'
            }}>
              AVG-proof. EU servers. Automatisch verwijderd.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Cards */}
      <section style={{ padding: '40px 0 80px', background: '#080d14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {trustCards.map((card, index) => (
              <div 
                key={index}
                style={{
                  background: 'rgba(10, 18, 32, 0.8)',
                  border: '1px solid rgba(0, 184, 217, 0.15)',
                  borderRadius: '16px',
                  padding: '32px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 184, 217, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 184, 217, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'rgba(0, 184, 217, 0.1)',
                  border: '1px solid rgba(0, 184, 217, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <card.icon style={{ width: '28px', height: '28px', color: card.color }} />
                </div>

                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '12px'
                }}>
                  {card.title}
                </h3>

                <p style={{
                  fontSize: '15px',
                  color: '#8a9bb5',
                  lineHeight: 1.6
                }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Info */}
      <section style={{ padding: '40px 0', background: '#0a1220', borderTop: '1px solid rgba(0, 184, 217, 0.1)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '24px' }}>
              Meer informatie
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
              <Link 
                href="/verwerkersovereenkomst"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(0, 184, 217, 0.1)',
                  border: '1px solid rgba(0, 184, 217, 0.3)',
                  color: '#00b8d9',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 184, 217, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 184, 217, 0.1)';
                }}
              >
                <FileText className="w-4 h-4" />
                Verwerkersovereenkomst
              </Link>

              <Link 
                href="/privacy"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: '1px solid rgba(107, 127, 163, 0.3)',
                  color: '#6b7fa3',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 184, 217, 0.5)';
                  e.currentTarget.style.color = '#00b8d9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(107, 127, 163, 0.3)';
                  e.currentTarget.style.color = '#6b7fa3';
                }}
              >
                Privacybeleid
              </Link>
            </div>

            <div style={{
              background: 'rgba(10, 18, 32, 0.8)',
              border: '1px solid rgba(0, 184, 217, 0.15)',
              borderRadius: '12px',
              padding: '24px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Mail className="w-5 h-5" style={{ color: '#00b8d9' }} />
              <span style={{ color: '#8a9bb5' }}>
                Privacy vragen?{' '}
                <a 
                  href="mailto:privacy@bscpro.nl" 
                  style={{ color: '#00b8d9', textDecoration: 'none' }}
                >
                  privacy@bscpro.nl
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section style={{ padding: '40px 0', background: '#080d14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6b7fa3',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            className="hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </Link>
        </div>
      </section>
    </div>
  );
}
