import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div style={{ width: '40px', height: '40px' }} />

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        border: '1px solid rgba(0, 184, 217, 0.3)',
        background: isDark ? 'rgba(0, 184, 217, 0.1)' : 'rgba(0, 184, 217, 0.05)',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      title={isDark ? 'Schakel naar licht thema' : 'Schakel naar donker thema'}
    >
      {isDark ? (
        <Sun style={{ width: '20px', height: '20px', color: '#00b8d9' }} />
      ) : (
        <Moon style={{ width: '20px', height: '20px', color: '#00b8d9' }} />
      )}
    </button>
  )
}
