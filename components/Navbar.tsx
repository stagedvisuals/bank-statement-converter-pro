'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '#calculator', label: 'Bereken je winst' },
    { href: '#pricing', label: 'Prijzen' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/voorwaarden', label: 'Voorwaarden' },
  ];

  return (
    <nav 
      style={{ 
        background: 'rgba(8, 13, 20, 0.95)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 184, 217, 0.1)',
        padding: '0 16px', 
        height: '72px', 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50
      }}
    >
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center">
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img 
            src="/logo.svg" 
            alt="BSC Pro" 
            style={{ height: '36px', width: 'auto' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
              BSC<span style={{ color: '#00b8d9' }}>PRO</span>
            </span>
            <span className="hidden md:block" style={{ fontSize: '8px', color: '#6b7fa3', marginTop: '2px' }}>
              BANK STATEMENT CONVERTER
            </span>
          </div>
        </Link>
        
        {/* Desktop links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ 
                color: '#6b7fa3', 
                fontSize: '14px', 
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s' 
              }}
              className="hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        {/* Rechts: altijd inloggen + hamburger op mobiel */}
        <div className="flex items-center gap-2">
          <Link href="/login">
            <button 
              style={{ 
                background: 'transparent',
                border: '1px solid rgba(0, 184, 217, 0.3)',
                color: '#00b8d9',
                fontWeight: 500,
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 184, 217, 0.1)';
                e.currentTarget.style.borderColor = '#00b8d9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(0, 184, 217, 0.3)';
              }}
            >
              Inloggen
            </button>
          </Link>
          
          {/* Hamburger menu button - alleen mobiel */}
          <button 
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#00b8d9',
              fontSize: '24px',
              padding: '8px',
              cursor: 'pointer'
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      
      {/* Mobiel dropdown menu */}
      {menuOpen && (
        <div 
          className="md:hidden"
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            background: '#080d14',
            borderBottom: '1px solid rgba(0, 184, 217, 0.2)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ 
                color: '#6b7fa3', 
                fontSize: '16px', 
                textDecoration: 'none',
                fontWeight: 500,
                padding: '8px 0'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
