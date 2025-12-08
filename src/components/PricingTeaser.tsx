/**
 * Pricing Teaser sekcija za landing stranicu
 * 
 * Kratak pregled pricing planova sa CTA ka /pricing stranici.
 */

import Link from 'next/link';

export default function PricingTeaser() {
  return (
    <section className="section-container">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Odaberi Svoj Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Počni besplatno ili otključaj napredne funkcije sa Pro i Premium planovima.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* FREE */}
        <div className="card text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
          <div className="text-4xl font-bold text-gray-900 mb-4">
            €0<span className="text-lg text-gray-500 font-normal">/mes</span>
          </div>
          <p className="text-gray-600 mb-6">Probaj osnovne funkcije</p>
          <Link href="/pricing" className="btn-secondary w-full block text-center">
            Saznaj Više
          </Link>
        </div>

        {/* PRO - istaknuto */}
        <div className="card text-center border-2 border-primary-600 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-sm font-bold px-4 py-1 rounded-full">
            POPULARNO
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
          <div className="text-4xl font-bold text-primary-600 mb-4">
            €9.99<span className="text-lg text-gray-500 font-normal">/mes</span>
          </div>
          <p className="text-gray-600 mb-6">Za ozbiljne analitičare</p>
          <Link href="/pricing" className="btn-primary w-full block text-center">
            Aktiviraj Pro
          </Link>
        </div>

        {/* PREMIUM */}
        <div className="card text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
          <div className="text-4xl font-bold text-gray-900 mb-4">
            €19.99<span className="text-lg text-gray-500 font-normal">/mes</span>
          </div>
          <p className="text-gray-600 mb-6">Maksimalne mogućnosti</p>
          <Link href="/pricing" className="btn-secondary w-full block text-center">
            Saznaj Više
          </Link>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/pricing" className="text-primary-600 font-medium hover:underline">
          Pogledaj detaljno poređenje planova →
        </Link>
      </div>
    </section>
  );
}
