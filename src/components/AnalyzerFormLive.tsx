/**
 * Enhanced Analyzer Form komponenta
 * 
 * Forma za analizu mečeva sa live podacima iz The Odds API.
 * Dinamički učitava sportove, mečeve i kvote.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnalyzeRequest, AnalyzeResponse } from '@/types';

// Tipovi za API response
interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
}

interface SportGroup {
  group: string;
  sports: Sport[];
}

interface OddsEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  analysis?: {
    averageOdds: {
      home: number;
      draw: number | null;
      away: number;
    };
    impliedProbability: {
      home: number;
      draw: number | null;
      away: number;
    };
  };
}

interface AnalyzerFormProps {
  onResult: (result: AnalyzeResponse) => void;
  onLoading: (loading: boolean) => void;
}

export default function AnalyzerFormLive({ onResult, onLoading }: AnalyzerFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [sportGroups, setSportGroups] = useState<SportGroup[]>([]);
  const [events, setEvents] = useState<OddsEvent[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<OddsEvent | null>(null);
  const [loadingSports, setLoadingSports] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingOdds, setLoadingOdds] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(true);

  // Učitaj sportove na mount
  useEffect(() => {
    async function fetchSports() {
      try {
        const response = await fetch('/api/sports');
        if (!response.ok) {
          const data = await response.json();
          if (data.error?.includes('not configured')) {
            setApiConfigured(false);
            setManualMode(true);
          }
          throw new Error(data.error || 'Failed to fetch sports');
        }
        const data = await response.json();
        setSportGroups(data.grouped || []);
      } catch (err) {
        console.error('Error fetching sports:', err);
        // Ako API nije konfigurisan, prebaci na manual mode
        setManualMode(true);
      } finally {
        setLoadingSports(false);
      }
    }

    fetchSports();
  }, []);

  // Učitaj događaje kad se promeni sport
  const fetchEvents = useCallback(async (sportKey: string) => {
    if (!sportKey || manualMode) return;

    setLoadingEvents(true);
    setEvents([]);
    setSelectedEvent(null);

    try {
      const response = await fetch(`/api/events/${sportKey}`);
      if (!response.ok) throw new Error('Failed to fetch events');

      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Greška pri učitavanju mečeva. Probaj ponovo.');
    } finally {
      setLoadingEvents(false);
    }
  }, [manualMode]);

  // Učitaj kvote za izabrani događaj
  const fetchOdds = useCallback(async (sportKey: string, eventId: string) => {
    if (!sportKey || !eventId || manualMode) return;

    setLoadingOdds(true);

    try {
      const response = await fetch(`/api/odds/${sportKey}?regions=eu&markets=h2h`);
      if (!response.ok) throw new Error('Failed to fetch odds');

      const data = await response.json();
      const eventWithOdds = data.events?.find((e: OddsEvent) => e.id === eventId);

      if (eventWithOdds) {
        setSelectedEvent(eventWithOdds);
      }
    } catch (err) {
      console.error('Error fetching odds:', err);
    } finally {
      setLoadingOdds(false);
    }
  }, [manualMode]);

  // Handler za promenu sporta
  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sportKey = e.target.value;
    setSelectedSport(sportKey);
    setSelectedEvent(null);
    if (sportKey) {
      fetchEvents(sportKey);
    }
  };

  // Handler za promenu događaja
  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventId = e.target.value;
    const event = events.find(ev => ev.id === eventId);

    if (event) {
      setSelectedEvent(event);
      fetchOdds(selectedSport, eventId);
    }
  };

  // Handler za submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    onLoading(true);

    const formData = new FormData(e.currentTarget);

    // Validacija i parsiranje podataka
    const data: AnalyzeRequest = {
      sport: formData.get('sport') as string || selectedEvent?.sport_title || '',
      league: formData.get('league') as string || selectedEvent?.sport_title || '',
      teamA: formData.get('teamA') as string || selectedEvent?.home_team || '',
      teamB: formData.get('teamB') as string || selectedEvent?.away_team || '',
      odds: {
        home: parseFloat(formData.get('oddsHome') as string) || selectedEvent?.analysis?.averageOdds.home || 0,
        draw: parseFloat(formData.get('oddsDraw') as string) || selectedEvent?.analysis?.averageOdds.draw || 0,
        away: parseFloat(formData.get('oddsAway') as string) || selectedEvent?.analysis?.averageOdds.away || 0,
      },
      userPrediction: formData.get('userPrediction') as string,
      stake: parseFloat(formData.get('stake') as string) || 0,
    };

    // Osnovna validacija
    if (!data.teamA || !data.teamB) {
      setError('Molimo popuni timove ili izaberi meč.');
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

  // Format datuma
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-Latn', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Manual mode fallback (statička lista sportova)
  const manualSports = [
    'Fudbal',
    'Košarka',
    'Tenis',
    'Hokej',
    'Američki fudbal',
    'Bejzbol',
    'Drugi',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* API Status / Mode Toggle */}
      {!apiConfigured && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
          <strong>Napomena:</strong> The Odds API nije konfigurisan. 
          Koristi se ručni unos podataka. Dodaj <code>ODDS_API_KEY</code> u .env.local za live podatke.
        </div>
      )}

      {apiConfigured && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Izvor podataka:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setManualMode(false)}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                !manualMode
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              📡 Live Mečevi
            </button>
            <button
              type="button"
              onClick={() => setManualMode(true)}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                manualMode
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              ✏️ Ručni Unos
            </button>
          </div>
        </div>
      )}

      {/* LIVE MODE - Izbor sporta i meča */}
      {!manualMode && (
        <>
          {/* Sport Selector */}
          <div>
            <label htmlFor="sportSelect" className="input-label">
              Izaberi Sport *
            </label>
            {loadingSports ? (
              <div className="input-field bg-slate-700 animate-pulse">Učitavanje...</div>
            ) : (
              <select
                id="sportSelect"
                value={selectedSport}
                onChange={handleSportChange}
                className="input-field"
              >
                <option value="">-- Izaberi sport --</option>
                {sportGroups.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.sports.map((sport) => (
                      <option key={sport.key} value={sport.key}>
                        {sport.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>

          {/* Event Selector */}
          {selectedSport && (
            <div>
              <label htmlFor="eventSelect" className="input-label">
                Izaberi Meč *
              </label>
              {loadingEvents ? (
                <div className="input-field bg-slate-700 animate-pulse">Učitavanje mečeva...</div>
              ) : events.length === 0 ? (
                <div className="text-yellow-500 text-sm">
                  Nema dostupnih mečeva za ovaj sport trenutno.
                </div>
              ) : (
                <select
                  id="eventSelect"
                  onChange={handleEventChange}
                  className="input-field"
                >
                  <option value="">-- Izaberi meč --</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.home_team} vs {event.away_team} ({formatDate(event.commence_time)})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Selected Match Preview */}
          {selectedEvent && (
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-400 mb-2">Izabrani Meč</h4>
              <div className="text-center mb-4">
                <span className="text-lg">
                  {selectedEvent.home_team} <span className="text-gray-500">vs</span> {selectedEvent.away_team}
                </span>
                <div className="text-xs text-gray-500">{formatDate(selectedEvent.commence_time)}</div>
              </div>

              {/* Odds Display */}
              {loadingOdds ? (
                <div className="text-center text-gray-400 animate-pulse">Učitavanje kvota...</div>
              ) : selectedEvent.analysis ? (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-800 rounded p-2">
                    <div className="text-xs text-gray-500">1 (Domaćin)</div>
                    <div className="text-xl font-bold text-white">
                      {selectedEvent.analysis.averageOdds.home.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedEvent.analysis.impliedProbability.home}%
                    </div>
                  </div>
                  {selectedEvent.analysis.averageOdds.draw && (
                    <div className="bg-slate-800 rounded p-2">
                      <div className="text-xs text-gray-500">X (Nerešeno)</div>
                      <div className="text-xl font-bold text-white">
                        {selectedEvent.analysis.averageOdds.draw.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedEvent.analysis.impliedProbability.draw}%
                      </div>
                    </div>
                  )}
                  <div className="bg-slate-800 rounded p-2">
                    <div className="text-xs text-gray-500">2 (Gost)</div>
                    <div className="text-xl font-bold text-white">
                      {selectedEvent.analysis.averageOdds.away.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedEvent.analysis.impliedProbability.away}%
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  Kvote će biti učitane automatski
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* MANUAL MODE - Ručni unos */}
      {manualMode && (
        <>
          {/* Sport i Liga */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sport" className="input-label">
                Sport *
              </label>
              <select id="sport" name="sport" required className="input-field">
                <option value="">Izaberi sport</option>
                {manualSports.map((sport) => (
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
        </>
      )}

      {/* Hidden fields za live mode - šalju se podaci iz selectedEvent */}
      {!manualMode && selectedEvent && (
        <>
          <input type="hidden" name="sport" value={selectedEvent.sport_title} />
          <input type="hidden" name="league" value={selectedEvent.sport_title} />
          <input type="hidden" name="teamA" value={selectedEvent.home_team} />
          <input type="hidden" name="teamB" value={selectedEvent.away_team} />
          <input type="hidden" name="oddsHome" value={selectedEvent.analysis?.averageOdds.home || 0} />
          <input type="hidden" name="oddsDraw" value={selectedEvent.analysis?.averageOdds.draw || 0} />
          <input type="hidden" name="oddsAway" value={selectedEvent.analysis?.averageOdds.away || 0} />
        </>
      )}

      {/* Tvoj tip i ulog - zajednički za oba moda */}
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
      <button
        type="submit"
        disabled={!manualMode && !selectedEvent}
        className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!manualMode && !selectedEvent ? 'Izaberi meč za analizu' : 'Analiziraj Meč'}
      </button>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center">
        * Obavezna polja. Analiza je informativne prirode i ne garantuje nikakav ishod.
        {!manualMode && ' Kvote su prosečne vrednosti sa više bookmakera.'}
      </p>
    </form>
  );
}
