/**
 * Why Not Tipster sekcija
 * 
 * VAŽNO: Ova sekcija je ključna za pozicioniranje BetSense AI
 * kao edukativni alat, a NE kao tipster servis.
 * 
 * Ovo je bitno iz regulatornih i etičkih razloga.
 */

export default function WhyNotTipster() {
  return (
    <section className="bg-gray-900 text-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Leva strana - tekst */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-accent-red/20 rounded-full text-sm font-medium text-accent-red mb-6">
              ⚠️ Važno razumeti
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Zašto <span className="text-accent-red line-through">Nismo</span> Tipster Servis
            </h2>
            
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                <strong className="text-white">BetSense AI nije tipster.</strong> Ne prodajemo 
                "sigurne tipove", ne obećavamo dobitke i ne tvrdimo da imamo tajne informacije.
              </p>
              <p>
                Naš alat koristi dostupne javne podatke i AI algoritme da generiše 
                <strong className="text-white"> analitičke procene</strong> — ali svaka procena 
                ima marginu greške i nikada nije garancija.
              </p>
              <p>
                Klađenje uvek nosi rizik. Naš cilj je da ti pružimo 
                <strong className="text-white"> bolji uvid</strong>, ne da donosimo odluke umesto tebe.
              </p>
            </div>
          </div>

          {/* Desna strana - poređenje */}
          <div className="space-y-6">
            {/* Šta JESMO */}
            <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-6">
              <h3 className="text-accent-green font-bold text-lg mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Šta BetSense AI JESTE
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-accent-green mt-1">✓</span>
                  Analitički alat baziran na AI
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-green mt-1">✓</span>
                  Edukativni resurs za razumevanje kvota
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-green mt-1">✓</span>
                  Transparentan u vezi sa ograničenjima
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-green mt-1">✓</span>
                  Promoter odgovornog klađenja
                </li>
              </ul>
            </div>

            {/* Šta NISMO */}
            <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl p-6">
              <h3 className="text-accent-red font-bold text-lg mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Šta BetSense AI NIJE
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-accent-red mt-1">✗</span>
                  Tipster servis sa "sigurnim tipovima"
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-red mt-1">✗</span>
                  Izvor "dojavnih" informacija
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-red mt-1">✗</span>
                  Garancija dobitka
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-red mt-1">✗</span>
                  Finansijski savetnik
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
