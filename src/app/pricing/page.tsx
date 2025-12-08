/**
 * Pricing Page (/pricing)
 * 
 * Stranica sa detaljnim pregledom pricing planova i Stripe checkout-om.
 */

import { Metadata } from 'next';
import PricingCards from '@/components/PricingCards';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Odaberi plan koji ti odgovara - Free, Pro ili Premium. AI analiza sportskih događaja.',
};

export default function PricingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header sekcija */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Jednostavno Određivanje Cena
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Bez skrivenih troškova. Otkaži kad hoćeš. Počni besplatno i nadogradi kada budeš spreman.
          </p>
        </div>
      </section>

      {/* Pricing kartice */}
      <section className="section-container -mt-8">
        <PricingCards />
      </section>

      {/* FAQ sekcija */}
      <section className="section-container">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Često Postavljana Pitanja
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-2">Mogu li da otkažem pretplatu?</h3>
            <p className="text-gray-600">
              Da, možeš otkazati pretplatu u bilo kom trenutku. Nema ugovora na određeno vreme. 
              Pristup ostaje aktivan do kraja plaćenog perioda.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-2">Koji načini plaćanja su podržani?</h3>
            <p className="text-gray-600">
              Prihvatamo sve glavne kartice (Visa, Mastercard, Amex) putem sigurnog Stripe payment sistema.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-2">Da li su analize garancija dobitka?</h3>
            <p className="text-gray-600">
              <strong>Ne.</strong> BetSense AI je analitički alat koji pruža procene bazirane na dostupnim podacima. 
              Sportsko klađenje uvek nosi rizik i ne možemo garantovati nikakav ishod.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-2">Šta dobijem sa Free planom?</h3>
            <p className="text-gray-600">
              Free plan uključuje 3 analize dnevno za fudbal. Odlično za probanje platforme 
              pre odluke o nadogradnji.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-amber-50 border-t border-amber-200 py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>⚠️ Napomena:</strong> Plaćanje za BetSense AI ne garantuje dobitke. 
            Naš alat je isključivo analitički i edukativni. Kladi se odgovorno i samo novcem koji možeš priuštiti da izgubiš.
          </p>
        </div>
      </section>
    </div>
  );
}
