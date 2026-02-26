import React from 'react';

export const Logo = () => (
  <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer">
    {/* Het Scanner Icoon */}
    <rect x="5" y="5" width="30" height="30" rx="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
    <path d="M5 20H35" stroke="#00b8d9" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 15L35 20L30 25" stroke="#00b8d9" strokeWidth="2" strokeLinejoin="round" />
    
    {/* De Tekst */}
    <text x="45" y="28" className="fill-slate-900 dark:fill-white font-black" style={{ fontSize: '22px', fontFamily: 'Inter, sans-serif' }}>
      BSC
    </text>
    <text x="95" y="28" fill="#00b8d9" className="font-black" style={{ fontSize: '22px', fontFamily: 'Inter, sans-serif' }}>
      PRO
    </text>
  </svg>
);
