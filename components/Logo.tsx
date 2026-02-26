import React from 'react';
import { useTheme } from 'next-themes';

export const Logo = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <svg width="160" height="44" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ronde Seal/Cirkel */}
      <g transform="translate(2, 2)">
        {/* Buitenste cirkel ring */}
        <circle cx="20" cy="20" r="19" stroke="#00b8d9" strokeWidth="2" fill="none" />
        
        {/* Binnenste cirkel achtergrond (licht in dark mode, wit in light mode) */}
        <circle 
          cx="20" 
          cy="20" 
          r="16" 
          fill={isDark ? "rgba(0, 184, 217, 0.1)" : "rgba(0, 184, 217, 0.05)"}
          stroke="#00b8d9"
          strokeWidth="1"
        />
        
        {/* Document icoon binnen de cirkel */}
        <path 
          d="M12 14V26H28V18L22 12H14C13 12 12 13 12 14Z" 
          fill="none" 
          stroke="#00b8d9" 
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        
        {/* Document lijnen */}
        <line x1="15" y1="17" x2="21" y2="17" stroke="#00b8d9" strokeWidth="1" strokeLinecap="round" />
        <line x1="15" y1="20" x2="25" y2="20" stroke="#00b8d9" strokeWidth="1" strokeLinecap="round" />
        <line x1="15" y1="23" x2="23" y2="23" stroke="#00b8d9" strokeWidth="1" strokeLinecap="round" />
        
        {/* Chip/Scan icoon in hoek */}
        <rect x="20" y="14" width="8" height="8" rx="1" fill="#00b8d9" fillOpacity="0.2" stroke="#00b8d9" strokeWidth="1" />
        <line x1="22" y1="16" x2="26" y2="16" stroke="#00b8d9" strokeWidth="0.75" />
        <line x1="22" y1="18" x2="26" y2="18" stroke="#00b8d9" strokeWidth="0.75" />
        
        {/* Scan lijn */}
        <line x1="8" y1="20" x2="32" y2="20" stroke="#00b8d9" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />
      </g>
      
      {/* Tekst BSC PRO */}
      <text 
        x="50" 
        y="29" 
        className="font-black"
        style={{ 
          fontSize: '22px', 
          fontFamily: 'Inter, sans-serif',
          fontWeight: 900,
          fill: isDark ? '#ffffff' : '#0f172a'
        }}
      >
        BSC
      </text>
      <text 
        x="98" 
        y="29" 
        className="font-black"
        style={{ 
          fontSize: '22px', 
          fontFamily: 'Inter, sans-serif',
          fontWeight: 900,
          fill: '#00b8d9'
        }}
      >
        PRO
      </text>
    </svg>
  );
};
