import Link from 'next/link';
import { Logo } from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#080d14] border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-slate-400 text-sm max-w-sm">
              AI-gedreven documentverwerking voor ondernemers. 
              Converteer bankafschriften en facturen automatisch naar Excel, CSV en MT940.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Testfase
              </span>
              <span className="text-slate-500 text-xs">v1.0 – In bèta</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  Prijzen
                </Link>
              </li>
              <li>
                <Link href="/moneybird/priverekening-pdf-importeren" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  Moneybird koppeling
                </Link>
              </li>
              <li>
                <Link href="/snelstart/rabobank-pdf-importeren" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  SnelStart koppeling
                </Link>
              </li>
              <li>
                <Link href="/exact-online/ing-prive-importeren" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  ING → Exact Online
                </Link>
              </li>
              <li>
                <Link href="/abn-amro/twinfield-importeren" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  ABN AMRO → Twinfield
                </Link>
              </li>
              <li>
                <Link href="/ing/afas-importeren" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  ING → AFAS
                </Link>
              </li>
              <li>
                <Link href="/rabobank/mt940-exporteren" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  Rabobank → MT940
                </Link>
              </li>
              <li>
                <Link href="/ing/mt940-exporteren" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  ING → MT940
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  API Documentatie
                </Link>
              </li>
            </ul>
          </div>

          {/* Juridisch */}
          <div>
            <h3 className="text-white font-semibold mb-4">Juridisch</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  Privacyverklaring
                </Link>
              </li>
              <li>
                <Link href="/voorwaarden" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  Algemene Voorwaarden
                </Link>
              </li>

              <li>
                <Link href="/beveiliging" className="text-slate-400 hover:text-[#00b8d9] text-sm transition-colors">
                  Beveiliging
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} BSC PRO. Alle rechten voorbehouden.
          </p>
          <p className="text-slate-600 text-xs text-center md:text-right max-w-md">
            BSC PRO is een ondersteunend hulpmiddel. Controleer alle uitgelezen data altijd zelf. 
            Wij zijn geen boekhoudkantoor en geven geen fiscaal advies.
          </p>
        </div>
      </div>
    </footer>
  );
}
