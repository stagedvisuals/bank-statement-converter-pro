'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all"
      title={isDark ? 'Schakel naar licht thema' : 'Schakel naar donker thema'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#00b8d9]" />
      ) : (
        <Moon className="w-4 h-4 text-[#00b8d9]" />
      )}
    </button>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '#calculator', label: 'Bereken je winst' },
    { href: '#pricing', label: 'Prijzen' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/voorwaarden', label: 'Voorwaarden' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="no-underline">
            <Logo />
          </Link>
          
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <button className="px-5 py-2 text-sm font-medium text-[#00b8d9] border border-cyan-500/30 rounded-md hover:bg-cyan-500/10 transition-all">
                Inloggen
              </button>
            </Link>
            
            <button 
              className="md:hidden p-2 text-[#00b8d9]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground font-medium py-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
