/**
 * Analyzer Page (/analyzer)
 * 
 * Glavna stranica za AI analizu sportskih događaja.
 * Sadrži formu za unos i prikaz rezultata.
 * 
 * Koristi AnalyzerFormLive za live podatke iz The Odds API.
 */

'use client';

import { useState } from 'react';
import AnalyzerFormLive from '@/components/AnalyzerFormLive';
import ResultCard from '@/components/ResultCard';
import { AnalyzeResponse } from '@/types';

export default function AnalyzerPage() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Match Analyzer</h1>
          <p className="text-xl text-gray-300">
            Izaberi meč iz live ponude ili unesi podatke ručno za AI analizu.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Leva strana - forma */}
            <div>
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Izaberi ili Unesi Meč</h2>
                <AnalyzerFormLive onResult={setResult} onLoading={setLoading} />
              </div>
            </div>

            {/* Desna strana - rezultat */}
            <div>
              {loading ? (
                <div className="card">
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg
                      className="animate-spin h-12 w-12 text-primary-600 mb-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <p className="text-gray-600 font-medium">AI analizira meč...</p>
                    <p className="text-gray-400 text-sm mt-2">Ovo može potrajati nekoliko sekundi</p>
                  </div>
                </div>
              ) : result ? (
                <ResultCard result={result} />
              ) : (
                <div className="card bg-gray-100 border-2 border-dashed border-gray-300">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg
                      className="w-16 h-16 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Rezultat Analize
                    </h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Izaberi meč iz live ponude ili unesi podatke ručno, pa klikni "Analiziraj Meč" za AI analizu.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 disclaimer-box">
            <p>
              <strong>⚠️ Napomena:</strong> AI analiza je informativne prirode i bazira se na 
              statističkim modelima. Ne garantujemo tačnost predviđanja. Svako klađenje 
              nosiš na sopstvenu odgovornost. Kladi se samo novcem koji možeš priuštiti da izgubiš.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
