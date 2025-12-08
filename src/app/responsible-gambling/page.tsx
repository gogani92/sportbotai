/**
 * Responsible Gambling Page (/responsible-gambling)
 * 
 * VAŽNA stranica koja promoviše odgovorno klađenje.
 * Ova stranica je etička i regulatorna obaveza.
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Responsible Gambling',
  description: 'Informacije o odgovornom klađenju i resursi za pomoć.',
};

export default function ResponsibleGamblingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-amber-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Odgovorno Klađenje</h1>
          <p className="text-xl text-amber-100">
            Klađenje treba da bude zabava, ne problem. Evo kako da se kladiš odgovorno.
          </p>
        </div>
      </section>

      {/* Glavni sadržaj */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          {/* Uvod */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Naša Posvećenost</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              BetSense AI je posvećen promovisanju odgovornog klađenja. Naš alat je dizajniran 
              da ti pomogne da donosiš informisane odluke, ali <strong>nikada ne treba da se 
              kladiš više nego što možeš priuštiti da izgubiš</strong>.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Sportsko klađenje nosi inherentni rizik. Čak i najbolje analize ne mogu garantovati 
              dobitak. Uvek se kladi odgovorno i prepoznaj znakove problematičnog klađenja.
            </p>
          </div>

          {/* Saveti */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Saveti za Odgovorno Klađenje</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Postavi Budžet</h3>
                  <p className="text-gray-600 text-sm">Odredi mesečni limit za klađenje i strogo ga se drži.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ograniči Vreme</h3>
                  <p className="text-gray-600 text-sm">Ne provodi previše vremena na klađenju. Postavi tajmer.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ne Juri Gubitke</h3>
                  <p className="text-gray-600 text-sm">Ako izgubiš, nemoj pokušavati da nadoknadiš većim ulozima.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Kladi se Trezvan</h3>
                  <p className="text-gray-600 text-sm">Nikada se ne kladi pod uticajem alkohola ili emocija.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Prepoznaj Signale</h3>
                  <p className="text-gray-600 text-sm">Budi svestan znakova zavisnosti i reaguj na vreme.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Zabava, ne Prihod</h3>
                  <p className="text-gray-600 text-sm">Klađenje nije način za zarađivanje novca. Tretiraj ga kao zabavu.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Znaci problema */}
          <div className="card mb-8 border-l-4 border-accent-red">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-accent-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Znaci Problematičnog Klađenja
            </h2>
            <p className="text-gray-600 mb-4">
              Ako prepoznaješ bilo koji od ovih znakova, možda je vreme da potražiš pomoć:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-accent-red">•</span>
                Kladiš se novcem namenjenim za račune ili osnovne potrebe
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-red">•</span>
                Lažeš porodici ili prijateljima o svom klađenju
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-red">•</span>
                Osećaš potrebu da kladiš sve veće iznose
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-red">•</span>
                Postaneš nervozan ili depresivan kada ne možeš da se kladiš
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-red">•</span>
                Zanemaruješ posao, školu ili porodicu zbog klađenja
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-red">•</span>
                Pozajmljuješ novac ili prodaješ stvari da bi se kladio
              </li>
            </ul>
          </div>

          {/* Resursi za pomoć */}
          <div className="card mb-8 bg-primary-50 border-primary-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resursi za Pomoć</h2>
            <p className="text-gray-600 mb-6">
              Ako ti ili neko koga poznaješ ima problem sa kockanjem, potraži pomoć:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="https://www.gamblersanonymous.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-primary-600">Gamblers Anonymous</h3>
                <p className="text-gray-600 text-sm">Međunarodna organizacija za podršku</p>
              </a>
              <a 
                href="https://www.begambleaware.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-primary-600">BeGambleAware</h3>
                <p className="text-gray-600 text-sm">Informacije i podrška</p>
              </a>
              <a 
                href="https://www.gamcare.org.uk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-primary-600">GamCare</h3>
                <p className="text-gray-600 text-sm">Besplatna podrška i savetovanje</p>
              </a>
              <a 
                href="https://www.ncpgambling.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-primary-600">NCPG</h3>
                <p className="text-gray-600 text-sm">National Council on Problem Gambling</p>
              </a>
            </div>
          </div>

          {/* Self-exclusion */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Samoograničenje</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ako osećaš da gubiš kontrolu, većina kladionica nudi opcije samoograničenja:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Dnevni/nedeljni/mesečni limiti depozita</li>
              <li>Limiti gubitaka</li>
              <li>Privremeno zamrzavanje naloga (cooling-off period)</li>
              <li>Permanentno samoiskjučenje</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Kontaktiraj svoju kladionicu za više informacija o ovim opcijama.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
