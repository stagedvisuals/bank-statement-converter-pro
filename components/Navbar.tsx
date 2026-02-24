'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav 
      style={{ 
        background: 'rgba(8, 13, 20, 0.9)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
        padding: '0 24px', 
        height: '72px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50
      }}
    >
      {/* Logo links */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="/logo-transparent.svg" 
          alt="BSC Pro" 
          style={{ display: 'block', height: '40px', width: 'auto' }} 
        />
      </Link>
      
      {/* Menu midden */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '32px' 
      }}>
        <a 
          href="#calculator" 
          style={{ 
            color: '#94a3b8', 
            fontSize: '14px', 
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s' 
          }}
          className="hover:text-white"
        >
          Bereken je winst
        </a>
        <a 
          href="#pricing" 
          style={{ 
            color: '#94a3b8', 
            fontSize: '14px', 
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s' 
          }}
          className="hover:text-white"
        >
          Prijzen
        </a>
        <Link 
          href="/privacy" 
          style={{ 
            color: '#94a3b8', 
            fontSize: '14px', 
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s' 
          }}
          className="hover:text-white"
        >
          Privacy
        </Link>
        <Link 
          href="/voorwaarden" 
          style={{ 
            color: '#94a3b8', 
            fontSize: '14px', 
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s' 
          }}
          className="hover:text-white"
        >
          Voorwaarden
        </Link>
      </div>
      
      {/* Inloggen knop rechts */}
      <Link href="/login">
        <button 
          style={{ 
            background: 'transparent',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            color: '#00d4ff',
            fontWeight: 500,
            borderRadius: '6px',
            padding: '8px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
            e.currentTarget.style.borderColor = '#00d4ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
          }}
        >
          Inloggen
        </button>
      </Link>
    </nav>
  );
}
