import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export function DynamicLogo() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), [])
  
  // Default to dark theme colors before mount
  const isDark = mounted ? theme === 'dark' : true

  return (
    <Link href="/" style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Logo Icon */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: '#00b8d9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#080d14" 
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" x2="8" y1="13" y2="13"/>
            <line x1="16" x2="8" y1="17" y2="17"/>
            <line x1="10" x2="8" y1="9" y2="9"/>
          </svg>
        </div>
        
        {/* Logo Text */}
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{
            fontSize: '22px',
            fontWeight: 900,
            color: isDark ? '#ffffff' : '#0f172a',
            letterSpacing: '-0.5px'
          }}>
            BSC
          </span>
          <span style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#00b8d9',
            letterSpacing: '-0.5px'
          }}>
            PRO
          </span>
        </div>
      </div>
    </Link>
  )
}
