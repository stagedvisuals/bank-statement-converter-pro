import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Neem contact op | BSCPro',
  description: 'Neem contact op met BSCPro. We reageren binnen 2 werkdagen.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-4">Neem contact op</h1>
          <p className="text-lg text-muted-foreground mb-8">We reageren binnen 2 werkdagen</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-card border border-border rounded-xl p-6">
              <form action="/api/contact" method="POST" className="space-y-4">
                <div>
                  <label htmlFor="naam" className="block text-sm font-medium text-foreground mb-1">Naam *</label>
                  <input
                    type="text"
                    id="naam"
                    name="naam"
                    required
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
                    placeholder="Jouw naam"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
                    placeholder="jouw@email.nl"
                  />
                </div>

                <div>
                  <label htmlFor="onderwerp" className="block text-sm font-medium text-foreground mb-1">Onderwerp *</label>
                  <select
                    id="onderwerp"
                    name="onderwerp"
                    required
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
                  >
                    <option value="">Kies een onderwerp</option>
                    <option value="algemeen">Algemene vraag</option>
                    <option value="technisch">Technisch probleem</option>
                    <option value="factuur">Factuur of betaling</option>
                    <option value="partnership">Partnership / samenwerking</option>
                    <option value="enterprise">Enterprise aanvraag</option>
                    <option value="anders">Anders</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bericht" className="block text-sm font-medium text-foreground mb-1">Bericht *</label>
                  <textarea
                    id="bericht"
                    name="bericht"
                    required
                    rows={5}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b8d9]"
                    placeholder="Vertel ons waarmee we je kunnen helpen..."
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    required
                    className="mt-1 w-4 h-4 rounded border-border text-[#00b8d9] focus:ring-[#00b8d9]"
                  />
                  <label htmlFor="privacy" className="text-sm text-muted-foreground">
                    Ik ga akkoord met de <Link href="/privacy" className="text-[#00b8d9] hover:underline">privacyverklaring</Link> *
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Verstuur bericht
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Direct contact</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:info@bscpro.nl" className="text-[#00b8d9] hover:underline">info@bscpro.nl</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🕐</span>
                    <div>
                      <p className="font-medium">Reactietijd</p>
                      <p className="text-muted-foreground">Binnen 2 werkdagen</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="font-medium">Locatie</p>
                      <p className="text-muted-foreground">Nederland</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⚠️ <strong>Let op:</strong> Dit contactformulier is voor algemene vragen. Voor dringende technische problemen, gebruik de live chat in je dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}