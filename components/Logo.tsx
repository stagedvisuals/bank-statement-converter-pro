import React from 'react';
import { useTheme } from 'next-themes';

export const Logo = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Ronde Seal Icoon - 32px */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Buitenste cirkel */}
        <circle cx="16" cy="16" r="15" stroke="#00b8d9" strokeWidth="2" fill="none" />
        
        {/* Binnenste cirkel met fill */}
        <circle 
          cx="16" 
          cy="16" 
          r="12" 
          fill={isDark ? "rgba(0, 184, 217, 0.15)" : "rgba(0, 184, 217, 0.08)"}
        />
        
        {/* Document icoon - vereenvoudigd */}
        <rect x="10" y="9" width="12" height="14" rx="1.5" stroke="#00b8d9" strokeWidth="1.5" fill="none" />
        <line x1="13" y1="13" x2="19" y2="13" stroke="#00b8d9" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="13" y1="16" x2="19" y2="16" stroke="#00b8d9" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="13" y1="19" x2="17" y2="19" stroke="#00b8d9" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Chip/QR code icoon */}
        <rect x="17" y="10" width="5" height="5" rx="1" fill="#00b8d9" fillOpacity="0.3" />
        <rect x="18.5" y="11.5" width="2" height="2" fill="#00b8d9" />
      </svg>
      
      {/* Tekst BSCPRO - 24px hoogte */}
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span 
          style={{ 
            fontSize: '24px', 
            fontFamily: 'Inter, Poppins, sans-serif',
            fontWeight: 800,
            color: isDark ? '#ffffff' : '#0f172a',
            letterSpacing: '-0.5px'
          }}
        >
          BSC
        </span>
        <span 
          style={{ 
            fontSize: '24px', 
            fontFamily: 'Inter, Poppins, sans-serif',
            fontWeight: 800,
            color: '#00b8d9',
            letterSpacing: '-0.5px'
          }}
        >
          PRO
        </span>
      </div>
    </div>
  );
};
