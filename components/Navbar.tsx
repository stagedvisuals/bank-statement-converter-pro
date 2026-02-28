'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, ChevronDown } from 'lucide-react';
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
  const [koppelingenOpen, setKoppelingenOpen] = useState(false);

  const navLinks = [
    { href: '/over-ons', label: 'Over ons' },
    { href: '/tools', label: 'Tools' },
    { href: '#calculator', label: 'Bereken je winst' },
    { href: '#pricing', label: 'Prijzen' },
  ];

  const koppelingenLinks = [
    { href: '/moneybird/priverekening-pdf-importeren', label: 'PDF → Moneybird' },
    { href: '/snelstart/rabobank-pdf-importeren', label: 'Rabobank → SnelStart' },
    { href: '/exact-online/ing-prive-importeren', label: 'ING → Exact Online' },
    { href: '/abn-amro/twinfield-importeren', label: 'ABN AMRO → Twinfield' },
    { href: '/ing/afas-importeren', label: 'ING → AFAS' },
    { href: '/rabobank/mt940-exporteren', label: 'Rabobank → MT940' },
    { href: '/ing/mt940-exporteren', label: 'ING → MT940' },
    { href: '/abn-amro/exact-online-importeren', label: 'ABN AMRO → Exact Online' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="no-underline shrink-0">
            <Logo />
          </Link>
          
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Integraties Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setKoppelingenOpen(true)}
                onMouseLeave={() => setKoppelingenOpen(false)}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors whitespace-nowrap"
              >
                Integraties
                <ChevronDown className={`w-4 h-4 transition-transform ${koppelingenOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {koppelingenOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                  {koppelingenLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setKoppelingenOpen(false)}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block">
              <button className="px-4 sm:px-5 py-2 text-sm font-medium text-[#00b8d9] border border-cyan-500/30 rounded-md hover:bg-cyan-500/10 transition-all whitespace-nowrap">
                Inloggen
              </button>
            </Link>
            
            <button 
              className="md:hidden p-2 text-[#00b8d9]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Sluit menu' : 'Open menu'}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto z-50 shadow-lg">
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
          
          {/* Mobile Integraties */}
          <div className="border-t border-border pt-4 mt-2">
            <p className="text-sm text-muted-foreground mb-2">Integraties</p>
            {koppelingenLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-muted-foreground hover:text-foreground py-2 pl-4"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-[#00b8d9] font-medium py-2 border-t border-border pt-4 mt-2"
          >
            Inloggen
          </Link>
        </div>
      )}
    </nav>
  );
}
