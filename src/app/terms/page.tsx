/**
 * Terms & Conditions Page (/terms)
 * 
 * Pravni uslovi korišćenja BetSense AI platforme.
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Uslovi korišćenja BetSense AI platforme.',
};

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
          <p className="text-gray-400 mt-2">Poslednje ažuriranje: Decembar 2024</p>
        </div>
      </section>

      {/* Sadržaj */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto prose prose-gray">
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Prihvatanje Uslova</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Korišćenjem BetSense AI platforme ("Usluga"), prihvataš ove Uslove korišćenja u celosti. 
              Ako se ne slažeš sa bilo kojim delom ovih uslova, ne smeš koristiti našu Uslugu.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Zadržavamo pravo da izmenimo ove uslove u bilo kom trenutku. Nastavak korišćenja Usluge 
              nakon izmena predstavlja prihvatanje novih uslova.
            </p>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Opis Usluge</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              BetSense AI je <strong>analitički i edukativni alat</strong> koji koristi algoritme 
              veštačke inteligencije za analizu sportskih događaja. Usluga pruža:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Procenjene verovatnoće ishoda sportskih događaja</li>
              <li>Analitičke komentare i procenu rizika</li>
              <li>Edukativne informacije o odgovornom klađenju</li>
            </ul>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
              <p className="text-amber-800 font-semibold">
                VAŽNO: BetSense AI NIJE tipster servis, NE pruža garantovane tipove, 
                dojave niti finansijski savet. Sve analize su isključivo informativne prirode.
              </p>
            </div>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Odricanje od Odgovornosti</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Korisnik izričito razume i prihvata sledeće:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Sportsko klađenje nosi inherentni rizik gubitka novca</li>
              <li>Nijedna analiza ne može garantovati dobitak</li>
              <li>Procene su bazirane na dostupnim podacima i imaju marginu greške</li>
              <li>Korisnik je jedini odgovoran za svoje odluke o klađenju</li>
              <li>BetSense AI ne snosi odgovornost za bilo kakve finansijske gubitke</li>
            </ul>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Uslovi Korišćenja</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Da bi koristio Uslugu, moraš:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Imati najmanje 18 godina starosti</li>
              <li>Nalaziti se u jurisdikciji gde je online klađenje legalno</li>
              <li>Ne koristiti Uslugu za ilegalne aktivnosti</li>
              <li>Ne pokušavati da manipulišeš ili zloupotrbiš sistem</li>
            </ul>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Pretplate i Plaćanje</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Za plaćene planove (Pro, Premium):
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Plaćanje se vrši putem Stripe payment sistema</li>
              <li>Pretplate se automatski obnavljaju mesečno</li>
              <li>Možeš otkazati pretplatu u bilo kom trenutku</li>
              <li>Povraćaj novca nije moguć za delimično iskorišćen period</li>
              <li>Cene su izražene u EUR i mogu se promeniti uz prethodno obaveštenje</li>
            </ul>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Intelektualna Svojina</h2>
            <p className="text-gray-600 leading-relaxed">
              Sav sadržaj na BetSense AI platformi, uključujući tekstove, grafiku, logotipe, 
              algoritme i softver, je vlasništvo BetSense AI ili naših licencora. 
              Nije dozvoljeno kopiranje, distribucija ili modifikacija bez pisane dozvole.
            </p>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Ograničenje Odgovornosti</h2>
            <p className="text-gray-600 leading-relaxed">
              U maksimalnoj meri dozvoljenoj zakonom, BetSense AI i njegovi vlasnici, zaposleni 
              i partneri neće biti odgovorni za bilo kakvu direktnu, indirektnu, slučajnu, 
              posebnu ili posledičnu štetu koja proizilazi iz korišćenja ili nemogućnosti 
              korišćenja Usluge.
            </p>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Primenjivo Pravo</h2>
            <p className="text-gray-600 leading-relaxed">
              Ovi Uslovi korišćenja su regulisani i tumače se u skladu sa zakonima jurisdikcije 
              u kojoj je BetSense AI registrovan. Bilo kakvi sporovi će se rešavati pred 
              nadležnim sudovima te jurisdikcije.
            </p>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Kontakt</h2>
            <p className="text-gray-600 leading-relaxed">
              Za sva pitanja u vezi sa ovim Uslovima korišćenja, kontaktiraj nas na:
              <br />
              <strong>Email:</strong> legal@betsenseai.com
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
