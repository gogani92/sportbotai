/**
 * Analyzer Form komponenta
 * 
 * Forma za unos podataka o meču koji treba analizirati.
 * Šalje podatke na /api/analyze endpoint.
 */

'use client';

import { useState } from 'react';
import { AnalyzeRequest, AnalyzeResponse } from '@/types';

interface AnalyzerFormProps {
  onResult: (result: AnalyzeResponse) => void;
  onLoading: (loading: boolean) => void;
}

export default function AnalyzerForm({ onResult, onLoading }: AnalyzerFormProps) {
  const [error, setError] = useState<string | null>(null);

  // Lista sportova za select
  const sports = [
    'Fudbal',
    'Košarka',
    'Tenis',
    'Hokej',
    'Američki fudbal',
    'Bejzbol',
    'Drugi',
  ];

  // Handler za submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    onLoading(true);

    const formData = new FormData(e.currentTarget);

    // Validacija i parsiranje podataka
    const data: AnalyzeRequest = {
      sport: formData.get('sport') as string,
      league: formData.get('league') as string,
      teamA: formData.get('teamA') as string,
      teamB: formData.get('teamB') as string,
      odds: {
        home: parseFloat(formData.get('oddsHome') as string) || 0,
        draw: parseFloat(formData.get('oddsDraw') as string) || 0,
        away: parseFloat(formData.get('oddsAway') as string) || 0,
      },
      userPrediction: formData.get('userPrediction') as string,
      stake: parseFloat(formData.get('stake') as string) || 0,
    };

    // Osnovna validacija
    if (!data.sport || !data.league || !data.teamA || !data.teamB) {
      setError('Molimo popuni sva obavezna polja.');
      onLoading(false);
      return;
    }

    if (data.odds.home <= 0 || data.odds.away <= 0) {
      setError('Kvote moraju biti veće od 0.');
      onLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Greška pri analizi');
      }

      onResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neočekivana greška');
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sport i Liga */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sport" className="input-label">
            Sport *
          </label>
          <select
            id="sport"
            name="sport"
            required
            className="input-field"
          >
            <option value="">Izaberi sport</option>
            {sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="league" className="input-label">
            Liga *
          </label>
          <input
            type="text"
            id="league"
            name="league"
            required
            placeholder="npr. Premier League, NBA..."
            className="input-field"
          />
        </div>
      </div>

      {/* Tim A vs Tim B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="teamA" className="input-label">
            Tim A (Domaćin) *
          </label>
          <input
            type="text"
            id="teamA"
            name="teamA"
            required
            placeholder="npr. Manchester United"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="teamB" className="input-label">
            Tim B (Gost) *
          </label>
          <input
            type="text"
            id="teamB"
            name="teamB"
            required
            placeholder="npr. Liverpool"
            className="input-field"
          />
        </div>
      </div>

      {/* Kvote */}
      <div>
        <label className="input-label">Kvote *</label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="oddsHome" className="text-xs text-gray-500 mb-1 block">
              1 (Domaćin)
            </label>
            <input
              type="number"
              id="oddsHome"
              name="oddsHome"
              required
              step="0.01"
              min="1"
              placeholder="2.10"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="oddsDraw" className="text-xs text-gray-500 mb-1 block">
              X (Nerešeno)
            </label>
            <input
              type="number"
              id="oddsDraw"
              name="oddsDraw"
              step="0.01"
              min="1"
              placeholder="3.40"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="oddsAway" className="text-xs text-gray-500 mb-1 block">
              2 (Gost)
            </label>
            <input
              type="number"
              id="oddsAway"
              name="oddsAway"
              required
              step="0.01"
              min="1"
              placeholder="3.20"
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Tvoj tip i ulog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="userPrediction" className="input-label">
            Tvoj Tip
          </label>
          <input
            type="text"
            id="userPrediction"
            name="userPrediction"
            placeholder="npr. 1, X, 2, GG, over 2.5..."
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="stake" className="input-label">
            Ulog (€)
          </label>
          <input
            type="number"
            id="stake"
            name="stake"
            step="0.01"
            min="0"
            placeholder="10.00"
            className="input-field"
          />
        </div>
      </div>

      {/* Error poruka */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit dugme */}
      <button type="submit" className="btn-primary w-full text-lg py-4">
        Analiziraj Meč
      </button>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center">
        * Obavezna polja. Analiza je informativne prirode i ne garantuje nikakav ishod.
      </p>
    </form>
  );
}
