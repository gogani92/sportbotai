/**
 * Privacy Policy Page (/privacy)
 * 
 * Politika privatnosti BetSense AI platforme.
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Politika privatnosti BetSense AI platforme.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-gray-400 mt-2">Poslednje ažuriranje: Decembar 2024</p>
        </div>
      </section>

      {/* Sadržaj */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Uvod</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              BetSense AI ("mi", "nas", "naš") poštuje privatnost svojih korisnika. 
              Ova Politika privatnosti objašnjava kako prikupljamo, koristimo, čuvamo 
              i štitimo tvoje podatke kada koristiš našu platformu.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Korišćenjem BetSense AI, pristaješ na prikupljanje i korišćenje informacija 
              u skladu sa ovom politikom.
            </p>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Podaci Koje Prikupljamo</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">2.1 Podaci koje nam direktno pružaš:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Email adresa (pri registraciji)</li>
              <li>Podaci o plaćanju (obrađuje Stripe, mi ne čuvamo podatke o karticama)</li>
              <li>Podaci koje unosiš u analyzer (sportovi, timovi, kvote)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">2.2 Automatski prikupljeni podaci:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>IP adresa</li>
              <li>Tip browser-a i operativnog sistema</li>
              <li>Stranice koje posećuješ i vreme provedeno na njima</li>
              <li>Kolačići (cookies) za funkcionalnost sajta</li>
            </ul>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Kako Koristimo Tvoje Podatke</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Tvoje podatke koristimo za:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Pružanje i održavanje Usluge</li>
              <li>Procesiranje plaćanja i upravljanje pretplatama</li>
              <li>Slanje obaveštenja o servisu (promene, održavanje)</li>
              <li>Poboljšanje korisničkog iskustva i performansi</li>
              <li>Analitiku korišćenja (anonimizovano)</li>
              <li>Prevenciju zloupotreba i sigurnosne svrhe</li>
            </ul>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Deljenje Podataka</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Ne prodajemo tvoje lične podatke trećim stranama.</strong>
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Delimo podatke samo sa:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Stripe:</strong> za obradu plaćanja (vidi Stripe-ovu politiku privatnosti)</li>
              <li><strong>Hosting provajderi:</strong> Vercel za hosting aplikacije</li>
              <li><strong>AI provajderi:</strong> OpenAI/Anthropic za procesiranje analiza (podaci su anonimizovani)</li>
              <li><strong>Pravni zahtevi:</strong> kada smo zakonski obavezni</li>
            </ul>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Kolačići (Cookies)</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Koristimo sledeće vrste kolačića:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Neophodni:</strong> za funkcionisanje sajta i autentifikaciju</li>
              <li><strong>Analitički:</strong> za razumevanje kako koristiš sajt</li>
              <li><strong>Funkcionalni:</strong> za pamćenje tvojih preferencija</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Možeš kontrolisati kolačiće kroz podešavanja svog browser-a.
            </p>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Sigurnost Podataka</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Implementiramo industrijske standarde za zaštitu podataka:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>HTTPS enkripcija za sve komunikacije</li>
              <li>Hashovanje lozinki (nikada ne čuvamo plain-text)</li>
              <li>Redovno ažuriranje sigurnosnih zakrpa</li>
              <li>Ograničen pristup podacima samo ovlašćenim osobama</li>
            </ul>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Tvoja Prava</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Imaš pravo da:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Zatražiš kopiju svojih podataka</li>
              <li>Ispravkas netačne podatke</li>
              <li>Zatražiš brisanje svojih podataka</li>
              <li>Povučeš pristanak za marketing komunikacije</li>
              <li>Prenosiš svoje podatke drugom servisu</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Za ostvarivanje ovih prava, kontaktiraj nas na privacy@betsenseai.com
            </p>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Čuvanje Podataka</h2>
            <p className="text-gray-600 leading-relaxed">
              Čuvamo tvoje podatke sve dok imaš aktivan nalog. Nakon brisanja naloga, 
              podaci će biti uklonjeni u roku od 30 dana, osim podataka koje smo zakonski 
              obavezni da čuvamo (npr. podaci o transakcijama za poreske svrhe).
            </p>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Maloletnici</h2>
            <p className="text-gray-600 leading-relaxed">
              BetSense AI nije namenjen osobama mlađim od 18 godina. Ne prikupljamo 
              svesno podatke od maloletnika. Ako saznaš da je maloletna osoba koristila 
              naš servis, molimo te da nas kontaktiraš.
            </p>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. Promene Politike</h2>
            <p className="text-gray-600 leading-relaxed">
              Možemo povremeno ažurirati ovu Politiku privatnosti. O značajnim promenama 
              ćemo te obavestiti putem email-a ili obaveštenja na platformi. Nastavak 
              korišćenja Usluge nakon izmena predstavlja prihvatanje nove politike.
            </p>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">11. Kontakt</h2>
            <p className="text-gray-600 leading-relaxed">
              Za sva pitanja u vezi sa privatnošću, kontaktiraj nas na:
              <br />
              <strong>Email:</strong> privacy@betsenseai.com
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
