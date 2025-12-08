/**
 * Hero sekcija za landing stranicu
 * 
 * Glavna vizuelna komponenta koja privlači pažnju korisnika
 * i objašnjava šta je BetSense AI.
 */

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden">
      {/* Dekorativni elementi u pozadini */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-gold rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-accent-green rounded-full mr-2 animate-pulse"></span>
            AI-Powered Analytics
          </div>

          {/* Glavni naslov */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Analiziraj Pametnije,
            <br />
            <span className="text-accent-gold">Ne Više</span>
          </h1>

          {/* Podnaslov */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            BetSense AI koristi naprednu analitiku da ti pruži dubinski uvid 
            u sportske događaje. Edukativni alat za informisane odluke.
          </p>

          {/* CTA dugmad */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/analyzer" 
              className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
            >
              Započni Analizu →
            </Link>
            <Link 
              href="/pricing" 
              className="btn-secondary bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-4 w-full sm:w-auto"
            >
              Pogledaj Cene
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-gray-400 text-sm mb-4">Zašto korisnici biraju BetSense AI</p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>AI Analiza</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Transparentnost</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Odgovorno Klađenje</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
