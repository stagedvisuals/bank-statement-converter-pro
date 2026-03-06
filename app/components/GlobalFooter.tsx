import Link from 'next/link'

export default function GlobalFooter() {
  return (
    <footer className="py-12 border-t border-border bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">BSC<span className="text-[#00b8d9]">PRO</span></h3>
            <p className="text-sm text-muted-foreground">De slimste manier om bankafschriften te converteren. Bespaar uren werk per maand.</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                🧪 Testfase
              </span>
              <span className="text-slate-500 text-xs">v1.0 – In bèta</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-[#00b8d9]">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-[#00b8d9]">Prijzen</Link></li>
              <li><Link href="#calculator" className="hover:text-[#00b8d9]">Besparing berekenen</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Koppelingen</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/moneybird/priverekening-pdf-importeren" className="hover:text-[#00b8d9]">PDF → Moneybird</Link></li>
              <li><Link href="/snelstart/rabobank-pdf-importeren" className="hover:text-[#00b8d9]">Rabobank → SnelStart</Link></li>
              <li><Link href="/exact-online/ing-prive-importeren" className="hover:text-[#00b8d9]">ING → Exact Online</Link></li>
              <li><Link href="/abn-amro/twinfield-importeren" className="hover:text-[#00b8d9]">ABN AMRO → Twinfield</Link></li>
              <li><Link href="/ing/afas-importeren" className="hover:text-[#00b8d9]">ING → AFAS</Link></li>
              <li><Link href="/rabobank/mt940-exporteren" className="hover:text-[#00b8d9]">Rabobank → MT940</Link></li>
              <li><Link href="/ing/mt940-exporteren" className="hover:text-[#00b8d9]">ING → MT940</Link></li>
              <li><Link href="/abn-amro/exact-online-importeren" className="hover:text-[#00b8d9]">ABN AMRO → Exact Online</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/api-docs" className="hover:text-[#00b8d9]">API Documentatie</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Juridisch</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-[#00b8d9]">Privacyverklaring</Link></li>
              <li><Link href="/voorwaarden" className="hover:text-[#00b8d9]">Algemene Voorwaarden</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">{new Date().getFullYear()} BSC Pro. Alle rechten voorbehouden.</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            BSC PRO is een ondersteunend hulpmiddel. Controleer alle uitgelezen data altijd zelf. 
            Wij zijn geen boekhoudkantoor en geven geen fiscaal advies.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>🍪</span>
              <span>Deze website gebruikt functionele cookies.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-[#00b8d9] transition-colors">Privacy</Link>
              <Link href="/voorwaarden" className="hover:text-[#00b8d9] transition-colors">Voorwaarden</Link>
              <Link href="/cookies" className="hover:text-[#00b8d9] transition-colors">Cookiebeleid</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
