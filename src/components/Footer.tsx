/**
 * Footer komponenta za BetSense AI
 * 
 * Sadrži linkove ka legalnim stranicama i globalni disclaimer.
 * VAŽNO: Disclaimer je obavezan element i mora biti vidljiv na svim stranicama.
 */

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Glavni disclaimer - OBAVEZNO prikazati */}
      <div className="bg-amber-900/30 border-t border-amber-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-amber-200 text-sm text-center leading-relaxed">
            <strong>⚠️ Važno upozorenje:</strong> BetSense AI je analitički i edukativni alat. 
            Ne pružamo garantovane tipove, dojave niti finansijski savet. 
            Sportsko klađenje nosi rizik gubitka novca. Kladite se odgovorno. 
            <strong> Samo 18+ korisnici.</strong>
          </p>
        </div>
      </div>

      {/* Footer sadržaj */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand kolona */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-white">BetSense</span>
              <span className="text-xl font-light text-gray-400">AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered analiza sportskih događaja. Edukativni alat za informisano 
              donošenje odluka u svetu sportskog klađenja.
            </p>
          </div>

          {/* Brzi linkovi */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigacija</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/analyzer" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Analyzer
                </Link>
              </li>
            </ul>
          </div>

          {/* Legalni linkovi */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/responsible-gambling" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Responsible Gambling
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} BetSense AI. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  );
}
