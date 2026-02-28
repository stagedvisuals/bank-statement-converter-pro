'use client';

import Link from 'next/link';
import { FileText, ArrowLeft, Printer, Download, Mail, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function VerwerkersovereenkomstPage() {
  const currentDate = new Date().toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen" style={{ background: '#080d14' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: '#080d14' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(0, 184, 217, 0.1)', 
              border: '1px solid rgba(0, 184, 217, 0.2)', 
              borderRadius: '999px', 
              padding: '8px 16px'
            }}>
              <FileText className="w-4 h-4" style={{ color: '#00b8d9' }} />
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#00b8d9' }}>Juridisch</span>
            </div>

            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 184, 217, 0.1)',
                border: '1px solid rgba(0, 184, 217, 0.3)',
                color: '#00b8d9',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 184, 217, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 184, 217, 0.1)';
              }}
            >
              <Printer className="w-4 h-4" />
              Download als PDF
            </button>
          </div>

          <h1 style={{
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '8px',
            lineHeight: 1.1,
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontSize: 'clamp(28px, 5vw, 48px)'
          }}>
            Verwerkersovereenkomst
          </h1>

          <p style={{ fontSize: '14px', color: '#6b7fa3' }}>
            Versie 1.0 | Datum: {currentDate}
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '40px 0 80px', background: '#080d14' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{
            background: 'rgba(10, 18, 32, 0.8)',
            border: '1px solid rgba(0, 184, 217, 0.15)',
            borderRadius: '16px',
            padding: '40px'
          }}>
            {/* Sectie 1: Partijen */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#00b8d9',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(0, 184, 217, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>1</span>
                Partijen
              </h2>
              <div style={{ 
                background: 'rgba(0, 184, 217, 0.05)', 
                borderLeft: '3px solid #00b8d9',
                padding: '16px 20px',
                borderRadius: '0 8px 8px 0'
              }}>
                <p style={{ color: '#e8edf5', marginBottom: '12px', lineHeight: 1.6 }}>
                  <strong style={{ color: '#ffffff' }}>Verwerker:</strong> BSCPro (bscpro.nl)
                </p>
                <p style={{ color: '#e8edf5', lineHeight: 1.6 }}>
                  <strong style={{ color: '#ffffff' }}>Verwerkingsverantwoordelijke:</strong> De klant
                </p>
              </div>
            </div>

            {/* Sectie 2: Doel */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#00b8d9',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(0, 184, 217, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>2</span>
                Doel van verwerking
              </h2>
              <p style={{ color: '#8a9bb5', lineHeight: 1.7, fontSize: '15px' }}>
                BSCPro verwerkt bankafschriften (PDF) uitsluitend voor conversie naar Excel, CSV en MT940 formaten. 
                De verwerking is geautomatiseerd en vindt plaats op beveiligde EU-servers.
              </p>
            </div>

            {/* Sectie 3: Bewaartermijn */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#00b8d9',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(0, 184, 217, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>3</span>
                Bewaartermijn
              </h2>
              <p style={{ color: '#8a9bb5', lineHeight: 1.7, fontSize: '15px' }}>
                Bestanden worden maximaal <strong style={{ color: '#ffffff' }}>1 uur</strong> bewaard na verwerking, 
                daarna automatisch en onherroepelijk verwijderd van onze servers. 
                We slaan geen kopieën of back-ups van je bankgegevens op.
              </p>
            </div>

            {/* Sectie 4: Beveiliging */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#00b8d9',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(0, 184, 217, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>4</span>
                Beveiligingsmaatregelen
              </h2>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {[
                  'HTTPS encryptie (256-bit SSL) voor alle verbindingen',
                  'EU-servers (Nederland & Duitsland)',
                  'Toegangscontrole via Supabase Row Level Security (RLS)',
                  'Geen verkoop van data aan derden',
                  'Regelmatige beveiligingsaudits',
                  'AVG/GDPR compliant infrastructuur'
                ].map((item, index) => (
                  <li 
                    key={index}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      color: '#8a9bb5',
                      fontSize: '15px'
                    }}
                  >
                    <Shield className="w-4 h-4" style={{ color: '#00b8d9', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sectie 5: Rechten */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#00b8d9',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(0, 184, 217, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>5</span>
                Rechten van betrokkenen
              </h2>
              <p style={{ color: '#8a9bb5', lineHeight: 1.7, fontSize: '15px', marginBottom: '16px' }}>
                Je hebt het recht op inzage, correctie en verwijdering van je persoonsgegevens. 
                Omdat we je bestanden binnen 1 uur verwijderen, is er meestal geen data meer beschikbaar om in te zien.
              </p>
              <div style={{
                background: 'rgba(0, 184, 217, 0.05)',
                border: '1px solid rgba(0, 184, 217, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Mail className="w-5 h-5" style={{ color: '#00b8d9' }} />
                <span style={{ color: '#e8edf5' }}>
                  Contact voor privacy vragen:{' '}
                  <a 
                    href="mailto:privacy@bscpro.nl"
                    style={{ color: '#00b8d9', textDecoration: 'none' }}
                  >
                    privacy@bscpro.nl
                  </a>
                </span>
              </div>
            </div>

            {/* Handtekening sectie (voor print) */}
            <div style={{ 
              marginTop: '60px', 
              paddingTop: '40px', 
              borderTop: '1px solid rgba(0, 184, 217, 0.15)',
              display: 'none'
            }} className="print-only">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                <div>
                  <p style={{ color: '#6b7fa3', fontSize: '14px', marginBottom: '60px' }}>Naam en handtekening Verwerker</p>
                  <div style={{ borderTop: '1px solid #6b7fa3', paddingTop: '8px' }}>
                    <p style={{ color: '#ffffff' }}>BSCPro</p>
                  </div>
                </div>
                <div>
                  <p style={{ color: '#6b7fa3', fontSize: '14px', marginBottom: '60px' }}>Naam en handtekening Verwerkingsverantwoordelijke</p>
                  <div style={{ borderTop: '1px solid #6b7fa3', paddingTop: '8px' }}>
                    <p style={{ color: '#ffffff' }}>_______________________</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section style={{ padding: '40px 0', background: '#080d14' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/beveiliging"
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
            Terug naar beveiliging
          </Link>
        </div>
      </section>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          nav, button, .print-only {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
}
